import * as vscode from 'vscode';
import { FileTracker } from './FileTracker';
import { MetroViewPanel } from './MetroViewPanel';
import { LocalMetroViewProvider } from './LocalMetroViewProvider';

export function activate(context: vscode.ExtensionContext) {


    const fileTracker = new FileTracker();

    const localProvider = new LocalMetroViewProvider(context.extensionUri, fileTracker);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(LocalMetroViewProvider.viewType, localProvider)
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
}

export function deactivate() { }
