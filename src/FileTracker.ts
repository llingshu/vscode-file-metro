import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MetroLayout, MetroNode } from './types';
import { v4 as uuidv4 } from 'uuid';

export class FileTracker {
    private layoutFilePath: string | undefined;
    private currentLayout: MetroLayout = { nodes: [], groups: [], edges: [] };

    private _onDidLayoutChange = new vscode.EventEmitter<MetroLayout>();
    public readonly onDidLayoutChange = this._onDidLayoutChange.event;

    private completedTasks: Record<string, number> = {}; // filePath -> timestamp
    private readonly COMPLETED_TASKS_KEY = 'metro.completedTasks';

    constructor(private context: vscode.ExtensionContext) {
        this.initialize();
    }

    private initialize() {
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
            const vscodeDir = path.join(rootPath, '.vscode');
            if (!fs.existsSync(vscodeDir)) {
                fs.mkdirSync(vscodeDir);
            }
            this.layoutFilePath = path.join(vscodeDir, 'metro-layout.json');

            // Load completion timestamps from DB
            this.completedTasks = this.context.workspaceState.get(this.COMPLETED_TASKS_KEY, {});

            this.loadLayout();
        }
    }

    public createNote(position: { x: number; y: number }): MetroNode | undefined {
        if (!vscode.workspace.workspaceFolders) return;
        const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const noteDir = path.join(rootPath, '.Note');
        if (!fs.existsSync(noteDir)) {
            fs.mkdirSync(noteDir);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `Note_${timestamp}.md`;
        const filePath = path.join(noteDir, fileName);

        fs.writeFileSync(filePath, '# New Note\n');

        const newNode: MetroNode = {
            id: uuidv4(),
            type: 'note',
            filePath: filePath,
            position: position,
            label: fileName,
            status: 'active',
            mark: 'none',
            color: ['#e3002c', '#007fd4', '#008000', '#f3a900', '#800080', '#ff7f00', '#a0a0a0'][Math.floor(Math.random() * 7)] // Assign random color
        };

        this.currentLayout.nodes.push(newNode);
        this.saveLayout(this.currentLayout);
        return newNode;
    }

    public loadLayout(): MetroLayout {
        if (this.layoutFilePath && fs.existsSync(this.layoutFilePath)) {
            try {
                const content = fs.readFileSync(this.layoutFilePath, 'utf-8');
                this.currentLayout = JSON.parse(content);
                this.checkFiles(); // Check for missing files on load
            } catch (e) {
                console.error('Failed to load metro layout:', e);
            }
        }
        return this.currentLayout;
    }

    public saveLayout(layout: MetroLayout) {
        // Detect completion status changes to sync with files
        layout.nodes.forEach(newNode => {
            const oldNode = this.currentLayout.nodes.find(n => n.id === newNode.id);
            if (oldNode && newNode.mark === 'task' && newNode.completed !== oldNode.completed) {
                // Status changed from Map UI
                if (newNode.filePath) {
                    this.updateTaskCompletion(newNode.filePath, !!newNode.completed);
                }
            }
        });

        // Preserve viewport and zoomLocked if not provided (e.g. from Local View)
        if (!layout.viewport && this.currentLayout.viewport) {
            layout.viewport = this.currentLayout.viewport;
        }
        if (layout.zoomLocked === undefined && this.currentLayout.zoomLocked !== undefined) {
            layout.zoomLocked = this.currentLayout.zoomLocked;
        }

        this.currentLayout = layout;
        if (this.layoutFilePath) {
            fs.writeFileSync(this.layoutFilePath, JSON.stringify(layout, null, 2));
        }
        this._onDidLayoutChange.fire(this.currentLayout);
    }

    public getLayout(): MetroLayout {
        return this.currentLayout;
    }

    public checkFiles() {
        let changed = false;
        this.currentLayout.nodes.forEach(node => {
            if (node.type === 'file') {
                const exists = fs.existsSync(node.filePath);
                const newStatus = exists ? 'active' : 'missing';
                if (node.status !== newStatus) {
                    node.status = newStatus;
                    changed = true;
                }
            }
        });
        if (changed) {
            this.saveLayout(this.currentLayout);
        }
    }

    public handleFileRename(oldPath: string, newPath: string) {
        let changed = false;
        this.currentLayout.nodes.forEach(node => {
            if (node.filePath === oldPath) {
                node.filePath = newPath;
                node.label = path.basename(newPath);
                node.status = 'active';
                changed = true;
            }
        });
        if (changed) {
            this.saveLayout(this.currentLayout);
        }
        return changed;
    }

    public handleFileDelete(filePath: string) {
        let changed = false;
        this.currentLayout.nodes.forEach(node => {
            if (node.filePath === filePath) {
                node.status = 'missing';
                changed = true;
            }
        });
        if (changed) {
            this.saveLayout(this.currentLayout);
        }
        return changed;
    }

    public renameFile(nodeId: string, oldPath: string, newName: string) {
        const dir = path.dirname(oldPath);
        const newPath = path.join(dir, newName);

        try {
            fs.renameSync(oldPath, newPath);

            // Update node in layout
            const node = this.currentLayout.nodes.find(n => n.id === nodeId);
            if (node) {
                node.filePath = newPath;
                node.label = newName;
                this.saveLayout(this.currentLayout);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to rename file: ${error}`);
        }
    }

    public createTask(name: string): string | undefined {
        if (!vscode.workspace.workspaceFolders) return;
        const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const taskDir = path.join(rootPath, '.Note', 'task');
        if (!fs.existsSync(path.dirname(taskDir))) {
            fs.mkdirSync(path.dirname(taskDir));
        }
        if (!fs.existsSync(taskDir)) {
            fs.mkdirSync(taskDir);
        }

        const fileName = `${name}.md`;
        const filePath = path.join(taskDir, fileName);

        // Don't overwrite if exists
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, `# ${name}\n\n[ ] Task status`);
        }

        return filePath;
    }

    public createTaskNode(name: string, position: { x: number; y: number }): MetroNode | undefined {
        const filePath = this.createTask(name);
        if (!filePath) return;

        const newNode: MetroNode = {
            id: uuidv4(),
            type: 'file',
            filePath: filePath,
            position: position,
            label: name + '.md',
            status: 'active',
            mark: 'task',
            color: ['#e3002c', '#007fd4', '#008000', '#f3a900', '#800080', '#ff7f00', '#a0a0a0'][Math.floor(Math.random() * 7)],
            completed: false
        };

        // Check if file is completed based on content [x]
        // But get timestamp from our DB
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            if (content.includes('[x]')) {
                newNode.completed = true;
                newNode.completedAt = this.completedTasks[filePath];
            }
        } catch { }

        this.currentLayout.nodes.push(newNode);
        this.saveLayout(this.currentLayout);
        return newNode;
    }

    public createNodeForFile(filePath: string, position: { x: number; y: number }, label?: string): MetroNode | undefined {
        if (!fs.existsSync(filePath)) return;

        const name = label || path.basename(filePath);
        const newNode: MetroNode = {
            id: uuidv4(),
            type: 'file',
            filePath: filePath,
            position: position,
            label: name,
            status: 'active',
            mark: filePath.includes('.Note/task') ? 'task' : 'none',
            color: ['#e3002c', '#007fd4', '#008000', '#f3a900', '#800080', '#ff7f00', '#a0a0a0'][Math.floor(Math.random() * 7)],
            completed: false
        };

        // Check completion status from content/DB
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            if (content.includes('[x]')) {
                newNode.completed = true;
                newNode.completedAt = this.completedTasks[filePath];
            }
        } catch { }

        this.currentLayout.nodes.push(newNode);
        this.saveLayout(this.currentLayout);
        return newNode;
    }

    public updateTaskCompletion(filePath: string, completed: boolean) {
        if (!fs.existsSync(filePath)) return;

        try {
            let content = fs.readFileSync(filePath, 'utf-8');
            const oldBox = completed ? '[ ]' : '[x]';
            const newBox = completed ? '[x]' : '[ ]';

            // 1. Update Checkbox in file
            if (content.includes(oldBox)) {
                content = content.replace(oldBox, newBox);
                fs.writeFileSync(filePath, content.trim());
            }

            // 2. Update Timestamp in DB
            if (completed) {
                this.completedTasks[filePath] = Date.now();
            } else {
                delete this.completedTasks[filePath];
            }
            this.context.workspaceState.update(this.COMPLETED_TASKS_KEY, this.completedTasks);

            const timestamp = this.completedTasks[filePath];

            // Update layout if node exists
            const node = this.currentLayout.nodes.find(n => n.filePath === filePath);
            if (node) {
                node.completed = completed;
                node.completedAt = timestamp;
                this.saveLayout(this.currentLayout);
            }
        } catch (e) {
            console.error('Failed to update task completion in file:', e);
        }
    }

    public deleteNode(nodeId: string) {
        this.currentLayout.nodes = this.currentLayout.nodes.filter(n => n.id !== nodeId);
        this.currentLayout.edges = this.currentLayout.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
        this.saveLayout(this.currentLayout);
    }

    public updateNodeColor(nodeId: string, color: string) {
        const node = this.currentLayout.nodes.find(n => n.id === nodeId);
        if (node) {
            node.color = color;
            this.saveLayout(this.currentLayout);
        }
    }
}
