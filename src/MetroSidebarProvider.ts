import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { FileTracker } from './FileTracker';
import { MetroNode } from './types';

export class MetroSidebarProvider implements vscode.TreeDataProvider<SidebarItem>, vscode.TreeDragAndDropController<SidebarItem> {
    public readonly dragMimeTypes = ['application/vnd.code.metro.ghost', 'text/uri-list', 'text/plain'];
    public readonly dropMimeTypes = ['application/vnd.code.metro.ghost', 'text/uri-list', 'text/plain'];

    // Phase 10: State-based Drag Drop
    public static pendingDragItems: SidebarItem[] = [];

    private _onDidChangeTreeData: vscode.EventEmitter<SidebarItem | undefined | null | void> = new vscode.EventEmitter<SidebarItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<SidebarItem | undefined | null | void> = this._onDidChangeTreeData.event;

    // Ghost Tasks Storage Key
    private static readonly GHOST_TASKS_KEY = 'metro.ghostTasks';

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _fileTracker: FileTracker,
        private readonly _context: vscode.ExtensionContext,
        private readonly _viewType: 'plan' | 'tasks' | 'coordinates' | 'done'
    ) {
        // Refresh when layout changes (e.g. creating nodes, changing marks)
        this._fileTracker.onDidLayoutChange(() => {
            this.refresh();
        });
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: SidebarItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: SidebarItem): Promise<SidebarItem[]> {
        if (element) {
            return Promise.resolve([]); // Flattened view, no children for items
        }

        switch (this._viewType) {
            case 'plan':
                return Promise.resolve(this.getGhostTasksItems());
            case 'tasks':
                return Promise.resolve(this.getTaskItems(false));
            case 'coordinates':
                return Promise.resolve(this.getCoordinateItems());
            case 'done':
                return Promise.resolve(this.getTaskItems(true));
        }
    }

    private getGhostTasksItems(): SidebarItem[] {
        const ghosts = this.getGhostTasks();
        return ghosts.map(g => {
            const item = new SidebarItem(
                g.label,
                vscode.TreeItemCollapsibleState.None,
                'ghost-task',
                undefined,
                `ghost-${g.id}`
            );

            // Use square icon for consistency with Plan style
            // Ghost tasks are Plan tasks
            const color = '#e3002c'; // Red for Plan? Or just use blue/default? Let's use Red for high viz or stick to #007fd4. 
            // Actually, Plan nodes on map default to blue or user color. Let's use blue default.
            const planColor = '#007fd4';
            const svgDataUri = this.getSquareIconSvg(planColor, g.completed || false);
            item.iconPath = vscode.Uri.parse(svgDataUri);

            return item;
        });
    }

    private getCoordinateItems(): SidebarItem[] {
        const coords = this._fileTracker.getLayout().nodes.filter(n => n.mark === 'coordinate');
        return coords.map(n => this.createNodeItem(n));
    }

    private getTaskItems(isDoneCategory: boolean): SidebarItem[] {
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const layout = this._fileTracker.getLayout();
        const nodes = layout.nodes;

        // Filter tasks from map
        const taskNodes = nodes.filter(n => n.mark === 'task');

        // Scan .Note/task directory for all files
        const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        let allTaskFiles: { label: string, filePath: string, completed: boolean, completedAt?: number, node?: MetroNode }[] = [];

        if (rootPath) {
            const taskDir = path.join(rootPath, '.Note', 'task');
            if (fs.existsSync(taskDir)) {
                const files = fs.readdirSync(taskDir).filter(f => f.endsWith('.md'));
                files.forEach(f => {
                    const filePath = path.resolve(path.join(taskDir, f)); // Normalize path
                    const node = taskNodes.find(n => path.resolve(n.filePath) === filePath);

                    let completed = node?.completed || false;
                    let completedAt = node?.completedAt;

                    // Deep check if node info is missing or outdated
                    try {
                        const content = fs.readFileSync(filePath, 'utf-8');
                        completed = content.includes('[x]');
                        // completedAt is now managed in DB, but node might have it cached
                    } catch { }

                    allTaskFiles.push({ label: f, filePath, completed, completedAt, node });
                });
            }
        }

        // Archive Logic: completedAt > 24h goes to Done Tasks
        const filteredTasks = allTaskFiles.filter(t => {
            const isArchived = t.completed && t.completedAt && (now - t.completedAt > oneDayMs);
            return isDoneCategory ? isArchived : !isArchived;
        });

        return filteredTasks.map(t => {
            if (t.node) {
                return this.createNodeItem(t.node);
            } else {
                // File not on map
                const item = new SidebarItem(
                    t.label,
                    vscode.TreeItemCollapsibleState.None,
                    'task-node',
                    undefined, // NO resourceUri to kill the default file icon
                    `unlinked-${t.filePath}`
                );
                // Set command to focusNode (which will do nothing if unlinked, satisfying "single click no reaction")
                item.command = {
                    command: 'metro.focusNode',
                    title: 'Focus Node',
                    arguments: [item] // Pass item to let command handler decide (hack for double click detection)
                };
                item.tooltip = t.filePath;
                item.contextValue = (item.contextValue || '') + ' can-open';

                // Use custom SVG for perfect square parity and color injection
                const color = '#a0a0a0'; // Gray for unlinked
                const svgDataUri = this.getSquareIconSvg(color, t.completed);
                item.iconPath = vscode.Uri.parse(svgDataUri);
                return item;
            }
        });
    }

    private getSquareIconSvg(color: string, filled: boolean): string {
        // 16x16 canvas, 16x16 square (max size, pos 0,0)
        const strokeWidth = 1.6;
        const rectSize = 16;
        const pos = 0;

        let svg = '';
        if (filled) {
            svg = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="${pos}" y="${pos}" width="${rectSize}" height="${rectSize}" rx="2" fill="${color}" /></svg>`;
        } else {
            // Adjust rectSize slightly for outline to avoid clipping stroke
            const adjSize = rectSize - strokeWidth;
            const adjPos = strokeWidth / 2;
            svg = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="${adjPos}" y="${adjPos}" width="${adjSize}" height="${adjSize}" rx="2" fill="none" stroke="${color}" stroke-width="${strokeWidth}" /></svg>`;
        }

        const base64 = Buffer.from(svg).toString('base64');
        return `data:image/svg+xml;base64,${base64}`;
    }

    private createNodeItem(node: MetroNode): SidebarItem {
        const label = node.label || path.basename(node.filePath);
        const item = new SidebarItem(
            label,
            vscode.TreeItemCollapsibleState.None,
            'node',
            undefined, // NO resourceUri here! This is the fix for the phantom icon.
            node.id
        );

        // Add manual open command if it has a file
        // Add manual open command if it has a file
        if (node.filePath) {
            item.command = {
                command: 'metro.focusNode',
                title: 'Focus Node',
                arguments: [item] // Changed from [node.id] to item object for consistency
            };
            item.tooltip = node.filePath;
            item.contextValue = (item.contextValue || '') + ' can-open';
        } else {
            // For ghost tasks or others without file, still focus
            item.command = {
                command: 'metro.focusNode',
                title: 'Focus Node',
                arguments: [item]
            };
        }

        // Use node color directly if valid hex, otherwise default to gray
        const hexColor = node.color ? node.color : '#a0a0a0';


        const metroColors = ['#e3002c', '#007fd4', '#008000', '#f3a900', '#800080', '#ff7f00', '#a0a0a0'];
        const colorIndex = node.color ? metroColors.findIndex(c => c.toLowerCase() === node.color?.toLowerCase()) : -1;
        const themeColorId = colorIndex !== -1 ? `metro.color${colorIndex}` : 'metro.color6';

        if (node.mark === 'task') {
            // Use custom SVG squares
            const svgDataUri = this.getSquareIconSvg(hexColor, node.completed ?? false);
            item.iconPath = vscode.Uri.parse(svgDataUri);
            item.contextValue = (item.contextValue || '') + ' task-node';
        } else if (node.mark === 'coordinate') {
            // Use custom SVG for coordinates (Phase 13: Concentric Circles)
            const svgDataUri = this.getCoordinateIconSvg(hexColor);
            item.iconPath = vscode.Uri.parse(svgDataUri);
            item.contextValue = (item.contextValue || '') + ' coordinate-node';
        }

        return item;
    }

    private getCoordinateIconSvg(color: string): string {
        // 16x16 canvas, sharpened for integer alignment
        // Center: 8,8
        // Stroke: 1.5 (centered on 0.75 offset) or 2 (centered on integer)
        // Let's use 2px stroke for outer to match map style, but 1.5 for inner to fit?
        // Actually, for 16px icons, 2px might be too thick. Let's stick to 1.5 but correct the radii.

        const cx = 8;
        const cy = 8;
        const strokeWidth = 1.6; // slightly sharper than 1.5 on some screens

        // Outer: r=6 (d=12). Edge at 2 and 14. 
        // With 1.6 stroke -> 1.2 to 2.8. Good enough.
        const rOuter = 6;
        const rInner = 3.5;
        const rCenter = 1.5;

        const svg = `
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="display:block">
            <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />
            <circle cx="${cx}" cy="${cy}" r="${rInner}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />
            <circle cx="${cx}" cy="${cy}" r="${rCenter}" fill="${color}" stroke="none" />
        </svg>
        `.trim();

        const base64 = Buffer.from(svg).toString('base64');
        return `data:image/svg+xml;base64,${base64}`;
    }

    // --- Ghost Tasks Management ---

    // --- Ghost Tasks Management ---

    public getGhostTasks(): { id: string; label: string; completed?: boolean }[] {
        return this._context.workspaceState.get(MetroSidebarProvider.GHOST_TASKS_KEY, []);
    }

    public async addGhostTask(label: string) {
        const ghosts = this.getGhostTasks();
        const newGhost = { id: `ghost-${Date.now()}`, label, completed: false };
        await this._context.workspaceState.update(MetroSidebarProvider.GHOST_TASKS_KEY, [...ghosts, newGhost]);
        this.refresh();
    }

    public async removeGhostTask(id: string) {
        const ghosts = this.getGhostTasks();
        const updated = ghosts.filter(g => `ghost-${g.id}` !== id && g.id !== id); // Handle ID format flexibility
        await this._context.workspaceState.update(MetroSidebarProvider.GHOST_TASKS_KEY, updated);
        this.refresh();
    }

    public async toggleGhostTaskCompletion(id: string) {
        const ghosts = this.getGhostTasks();
        const updated = ghosts.map(g => {
            if (`ghost-${g.id}` === id || g.id === id) {
                return { ...g, completed: !g.completed };
            }
            return g;
        });
        await this._context.workspaceState.update(MetroSidebarProvider.GHOST_TASKS_KEY, updated);
        this.refresh();
    }

    // --- Drag and Drop ---

    // allow drag
    public async handleDrag(source: SidebarItem[], dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
        if (source.length === 0) { return; }

        // Store in static state for retrieval by Webview Panel (Phase 10: State-based Drag Drop)
        MetroSidebarProvider.pendingDragItems = source;

        // Include both ghost tasks and real tasks for dragging
        const dragItems = source.filter(s => s.contextValue === 'ghost-task' || s.contextValue === 'task-node');

        if (dragItems.length > 0) {
            const uris: string[] = [];
            const dragData = dragItems.map(item => {
                // If it's a real task node, it has a filePath. Otherwise it's a ghost.
                const filePath = item.command?.arguments?.[0]?.fsPath || item.tooltip;
                if (filePath && !item.id?.startsWith('ghost-')) {
                    uris.push(vscode.Uri.file(filePath).toString());
                }
                return {
                    id: item.id,
                    label: item.label,
                    filePath: filePath,
                    isGhost: item.contextValue === 'ghost-task'
                };
            });

            const dataStr = JSON.stringify(dragData);
            console.log('MetroSidebarProvider: Setting drag data:', dataStr);
            console.log('MetroSidebarProvider: URIs:', uris);
            dataTransfer.set('application/vnd.code.metro.ghost', new vscode.DataTransferItem(dataStr));
            dataTransfer.set('text/plain', new vscode.DataTransferItem(dataStr));

            if (uris.length > 0) {
                dataTransfer.set('text/uri-list', new vscode.DataTransferItem(uris.join('\r\n')));
            }
        }
    }
}

export class SidebarItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        contextValue: string, // Not a class property, just a param
        public readonly resourceUri?: vscode.Uri,
        public readonly id?: string,
    ) {
        super(label, collapsibleState);
        this.tooltip = this.label;
        this.contextValue = contextValue;
    }
}
