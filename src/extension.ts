import * as vscode from 'vscode';
import { FileTracker } from './FileTracker';
import { MetroViewPanel } from './MetroViewPanel';

export function activate(context: vscode.ExtensionContext) {


    const fileTracker = new FileTracker();

    context.subscriptions.push(
        vscode.commands.registerCommand('metro.open', () => {
            MetroViewPanel.createOrShow(context.extensionUri, fileTracker);
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidRenameFiles(e => {
            e.files.forEach(file => {
                const changed = fileTracker.handleFileRename(file.oldUri.fsPath, file.newUri.fsPath);
                if (changed && MetroViewPanel.currentPanel) {
                    MetroViewPanel.currentPanel.updateLayout(fileTracker.getLayout());
                }
            });
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidDeleteFiles(e => {
            e.files.forEach(file => {
                const changed = fileTracker.handleFileDelete(file.fsPath);
                if (changed && MetroViewPanel.currentPanel) {
                    MetroViewPanel.currentPanel.updateLayout(fileTracker.getLayout());
                }
            });
        })
    );
}

export function deactivate() { }
