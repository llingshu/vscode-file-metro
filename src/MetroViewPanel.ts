import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FileTracker } from './FileTracker';
import { MetroLayout } from './types';

export class MetroViewPanel {
    public static currentPanel: MetroViewPanel | undefined;
    public static readonly viewType = 'metroView';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private readonly _fileTracker: FileTracker;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri, fileTracker: FileTracker) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (MetroViewPanel.currentPanel) {
            MetroViewPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            MetroViewPanel.viewType,
            'Metro View',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'dist')
                ]
            }
        );

        MetroViewPanel.currentPanel = new MetroViewPanel(panel, extensionUri, fileTracker);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, fileTracker: FileTracker) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._fileTracker = fileTracker;

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'saveLayout':

                        this._fileTracker.saveLayout(message.layout);
                        return;
                    case 'openFile':
                        vscode.commands.executeCommand('vscode.open', vscode.Uri.file(message.filePath));
                        return;
                    case 'createNote':
                        this._fileTracker.createNote(message.position);
                        this.updateLayout(this._fileTracker.getLayout());
                        return;
                    case 'renameNode':
                        vscode.window.showInputBox({
                            prompt: 'Enter new name',
                            value: path.basename(message.oldPath)
                        }).then(newName => {
                            if (newName) {
                                this._fileTracker.renameFile(message.id, message.oldPath, newName);
                                this.updateLayout(this._fileTracker.getLayout());
                            }
                        });
                        return;
                    case 'webviewReady':
                        this.updateLayout(this._fileTracker.getLayout());
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public updateLayout(layout: MetroLayout) {
        this._panel.webview.postMessage({ command: 'updateLayout', layout });
    }

    private async openFile(filePath: string) {
        vscode.window.showInformationMessage(`Attempting to open: ${filePath}`);
        try {
            // Check if file exists first
            if (!fs.existsSync(filePath)) {
                vscode.window.showErrorMessage(`File not found: ${filePath}`);
                return;
            }

            const openPath = vscode.Uri.file(filePath);
            const doc = await vscode.workspace.openTextDocument(openPath);
            await vscode.window.showTextDocument(doc);
        } catch (error) {
            console.error('Failed to open file:', error);
            vscode.window.showErrorMessage(`Failed to open file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public dispose() {
        MetroViewPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js'));
        const nonce = getNonce();
        const config = vscode.workspace.getConfiguration('metro');

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Metro View</title>
                <style>
                    body { padding: 0; margin: 0; width: 100%; height: 100vh; overflow: hidden; }
                </style>
                <script nonce="${nonce}">
                    window.initialConfig = {
                        showInactiveStations: ${config.get('showInactiveStations', true)}
                    };
                </script>
            </head>
            <body>
                <div id="root" style="width: 100%; height: 100%;"></div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
