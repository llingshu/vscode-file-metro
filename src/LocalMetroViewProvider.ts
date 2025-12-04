import * as vscode from 'vscode';
import * as path from 'path';
import { FileTracker } from './FileTracker';
import { MetroLayout } from './types';

export class LocalMetroViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'metro.localView';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _fileTracker: FileTracker
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'dist')
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case 'webviewReady':
                    this.updateLayout();
                    this.focusActiveFile();
                    break;
                case 'openFile':
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.file(data.filePath));
                    break;
            }
        });

        // Listen for active editor changes to update the view
        vscode.window.onDidChangeActiveTextEditor(() => {
            this.focusActiveFile();
        });
    }

    public updateLayout() {
        if (this._view) {
            this._view.webview.postMessage({
                command: 'updateLayout',
                layout: this._fileTracker.getLayout()
            });
        }
    }

    public focusActiveFile() {
        if (this._view && vscode.window.activeTextEditor) {
            const filePath = vscode.window.activeTextEditor.document.uri.fsPath;
            // Find the node ID for this file
            const layout = this._fileTracker.getLayout();
            const node = layout.nodes.find(n => n.filePath === filePath);

            if (node) {
                this._view.webview.postMessage({
                    command: 'focusNode',
                    nodeId: node.id
                });
            }
        }
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
                <title>Local Metro View</title>
                <style>
                    body { padding: 0; margin: 0; width: 100%; height: 100vh; overflow: hidden; }
                </style>
                <script nonce="${nonce}">
                    window.initialConfig = {
                        showInactiveStations: ${config.get('showInactiveStations', true)},
                        isLocal: true
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
