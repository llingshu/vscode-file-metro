import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FileTracker } from './FileTracker';
import { MetroViewPanel } from './MetroViewPanel';
import { LocalMetroViewProvider } from './LocalMetroViewProvider';
import { MetroSidebarProvider, SidebarItem } from './MetroSidebarProvider';

export function activate(context: vscode.ExtensionContext) {


    const fileTracker = new FileTracker(context);

    const localProvider = new LocalMetroViewProvider(context.extensionUri, fileTracker);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(LocalMetroViewProvider.viewType, localProvider)
    );

    context.subscriptions.push(
        fileTracker.onDidLayoutChange(() => {
            localProvider.updateLayout();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('metro.open', () => {
            MetroViewPanel.createOrShow(context.extensionUri, fileTracker);
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidRenameFiles(e => {
            e.files.forEach(file => {
                const changed = fileTracker.handleFileRename(file.oldUri.fsPath, file.newUri.fsPath);
                if (changed) {
                    if (MetroViewPanel.currentPanel) {
                        MetroViewPanel.currentPanel.updateLayout(fileTracker.getLayout());
                    }
                    localProvider.updateLayout();
                }
            });
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidDeleteFiles(e => {
            e.files.forEach(file => {
                const changed = fileTracker.handleFileDelete(file.fsPath);
                if (changed) {
                    if (MetroViewPanel.currentPanel) {
                        MetroViewPanel.currentPanel.updateLayout(fileTracker.getLayout());
                    }
                    localProvider.updateLayout();
                }
            });
        })
    );

    // Sidebar
    const providerPlan = new MetroSidebarProvider(context.extensionUri, fileTracker, context, 'plan');
    const providerTasks = new MetroSidebarProvider(context.extensionUri, fileTracker, context, 'tasks');
    const providerCoords = new MetroSidebarProvider(context.extensionUri, fileTracker, context, 'coordinates');
    const providerDone = new MetroSidebarProvider(context.extensionUri, fileTracker, context, 'done');

    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('metro.view.plan', providerPlan),
        vscode.window.registerTreeDataProvider('metro.view.tasks', providerTasks),
        vscode.window.registerTreeDataProvider('metro.view.coordinates', providerCoords),
        vscode.window.registerTreeDataProvider('metro.view.done', providerDone)
    );

    // Create Tree Views with D&D support
    context.subscriptions.push(
        vscode.window.createTreeView('metro.view.plan', { treeDataProvider: providerPlan, dragAndDropController: providerPlan }),
        vscode.window.createTreeView('metro.view.tasks', { treeDataProvider: providerTasks, dragAndDropController: providerTasks }),
        vscode.window.createTreeView('metro.view.coordinates', { treeDataProvider: providerCoords, dragAndDropController: providerCoords }),
        vscode.window.createTreeView('metro.view.done', { treeDataProvider: providerDone, dragAndDropController: providerDone })
    );

    // Removed legacy selection listener as command 'metro.focusNode' now handles interactions.
    context.subscriptions.push(
        vscode.commands.registerCommand('metro.addGhostTask', async () => {
            const name = await vscode.window.showInputBox({ prompt: 'Enter task name' });
            if (name) {
                await providerPlan.addGhostTask(name);
            }
        })
    );

    let lastClickId: string | undefined;
    let lastClickTime = 0;

    context.subscriptions.push(
        vscode.commands.registerCommand('metro.focusNode', (nodeId: string | any) => {
            // Check if arg is an item object (SidebarItem) or string
            const id = typeof nodeId === 'string' ? nodeId : nodeId?.id;
            const now = Date.now();

            if (id) {
                // Double Click Detection (300ms threshold)
                // We use id matching. If unlinked task, id is 'unlinked-/path/to/file'
                if (lastClickId === id && (now - lastClickTime) < 300) {
                    // Double Click Detected -> Open File
                    let filePath: string | undefined;

                    // Extract file path from ID or SidebarItem
                    if (typeof nodeId !== 'string' && nodeId.tooltip) {
                        filePath = nodeId.tooltip; // SidebarItem uses tooltip for path
                    } else if (id.startsWith('unlinked-')) {
                        filePath = id.substring(9);
                    } else {
                        // Lookup in layout
                        const node = fileTracker.getLayout().nodes.find(n => n.id === id);
                        filePath = node?.filePath;
                    }

                    if (filePath) {
                        vscode.commands.executeCommand('vscode.open', vscode.Uri.file(filePath));
                    }

                    // Reset click state
                    lastClickId = undefined;
                    lastClickTime = 0;
                    return;
                }

                // Single Click detected (or first click) -> Focus Logic
                lastClickId = id;
                lastClickTime = now;

                // 1. Focus Main Map
                if (MetroViewPanel.currentPanel) {
                    MetroViewPanel.currentPanel.focusNode(id);
                } else if (!localProvider.isVisible()) {
                    // Only open map if Local View is also not visible?
                    // Or maybe we don't open map on single click anymore if it's not open?
                    // User said: "In non-Metro View view... single click should transform LOCAL METRO VIEW"
                    // So we prioritize updating Local View and do NOT force open Main Map if closed.
                    // But if Main Map IS open, we update it.
                }

                // 2. Focus Local View (if active)
                // We need to implement focusNode on localProvider
                localProvider.focusNode(id);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('metro.deleteGhostTask', async (item: any) => {
            if (item && item.id) {
                await providerPlan.removeGhostTask(item.id);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('metro.toggleTaskCompletion', async (item: SidebarItem) => {
            // Check if it's a ghost task
            if (item.id?.startsWith('ghost-') || item.contextValue === 'ghost-task') {
                if (item.id) {
                    // ghost-task IDs in items are already like 'ghost-123'
                    // but provider expects 'ghost-123' or '123' depending on implementation
                    // Our implementation in MetroSidebarProvider.toggleGhostTaskCompletion handles `ghost-${id}` or `id` matching.
                    // But item.id here comes from `getGhostTasksItems` which sets it to `ghost-${g.id}`.
                    // Let's pass it directly.
                    await providerPlan.toggleGhostTaskCompletion(item.id);
                }
                return;
            }

            // item.id is either node.id or 'unlinked-' + filePath
            let filePath: string | undefined;
            if (item.id?.startsWith('unlinked-')) {
                filePath = item.id.substring(9);
            } else if (item.id) {
                const node = fileTracker.getLayout().nodes.find(n => n.id === item.id);
                filePath = node?.filePath;
            }

            if (filePath && fs.existsSync(filePath)) {
                try {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const isCompleted = content.includes('[x]');
                    fileTracker.updateTaskCompletion(filePath, !isCompleted);

                    if (MetroViewPanel.currentPanel) {
                        MetroViewPanel.currentPanel.updateLayout(fileTracker.getLayout());
                    }
                    // Refresh both affected views
                    providerTasks.refresh();
                    providerDone.refresh();
                } catch (e) {
                    console.error('Failed to toggle task completion:', e);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('metro.openGhostTask', async (item: any) => {
            if (item) {
                const ghostId = item.id.startsWith('ghost-') ? item.id.substring(6) : item.id;
                const filePath = fileTracker.createTask(item.label);
                if (filePath) {
                    await providerPlan.removeGhostTask(ghostId);
                    // Refresh Tasks view to show the new file
                    providerTasks.refresh();
                    providerDone.refresh();

                    const doc = await vscode.workspace.openTextDocument(filePath);
                    await vscode.window.showTextDocument(doc);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('metro.renameNode', async (item: SidebarItem) => {
            if (item && item.id) {
                const node = fileTracker.getLayout().nodes.find(n => n.id === item.id);
                if (node && node.filePath) {
                    const newName = await vscode.window.showInputBox({
                        prompt: 'Enter new name',
                        value: node.label
                    });
                    if (newName) {
                        fileTracker.renameFile(node.id, node.filePath, newName);
                        // Refreshes will be triggered by file watcher/layout update
                    }
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('metro.deleteNode', async (item: SidebarItem) => {
            if (item && item.id) {
                const answer = await vscode.window.showWarningMessage(`Are you sure you want to delete '${item.label}'?`, 'Yes', 'No');
                if (answer === 'Yes') {
                    fileTracker.deleteNode(item.id);
                    // Also delete file? MetroView implies stations are files. 
                    // Let's ask or just delete node from map. 
                    // Current behavior for 'Delete Station' in map is just map node removal.
                    // But here we are in sidebar. 
                    // Let's stick to Map Node removal for now as "Delete Station".
                    // If user wants to delete file, they can do it in Explorer.

                    if (MetroViewPanel.currentPanel) {
                        MetroViewPanel.currentPanel.updateLayout(fileTracker.getLayout());
                    }
                    localProvider.updateLayout();
                    // Refresh sidebar
                    providerTasks.refresh();
                    providerCoords.refresh();
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('metro.changeColor', async (item: SidebarItem) => {
            if (item && item.id) {
                const colors = [
                    { label: 'Red', description: '#e3002c' },
                    { label: 'Blue', description: '#007fd4' },
                    { label: 'Green', description: '#008000' },
                    { label: 'Yellow', description: '#f3a900' },
                    { label: 'Purple', description: '#800080' },
                    { label: 'Orange', description: '#ff7f00' },
                    { label: 'Gray', description: '#a0a0a0' }
                ];

                const picked = await vscode.window.showQuickPick(colors, { placeHolder: 'Select Color' });
                if (picked) {
                    fileTracker.updateNodeColor(item.id, picked.description);
                    if (MetroViewPanel.currentPanel) {
                        MetroViewPanel.currentPanel.updateLayout(fileTracker.getLayout());
                    }
                    localProvider.updateLayout();
                    // Refresh all potentially affected views
                    providerTasks.refresh();
                    providerCoords.refresh();
                }
            }
        })
    );
}

export function deactivate() { }
