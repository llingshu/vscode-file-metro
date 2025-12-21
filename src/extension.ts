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

    context.subscriptions.push(
        vscode.commands.registerCommand('metro.deleteGhostTask', async (item: any) => {
            if (item && item.id) {
                await providerPlan.removeGhostTask(item.id);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('metro.toggleTaskCompletion', async (item: SidebarItem) => {
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
                    const doc = await vscode.workspace.openTextDocument(filePath);
                    await vscode.window.showTextDocument(doc);
                }
            }
        })
    );
}

export function deactivate() { }
