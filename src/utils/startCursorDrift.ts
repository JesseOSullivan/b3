import * as vscode from 'vscode';

export function startCursorDrift() {
    vscode.workspace.onDidChangeTextDocument(event => {
        if (Math.random() > 0.991) { 
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const newPosition = editor.selection.active.translate(0, Math.random() > 0.5 ? 1 : -1);
                editor.selection = new vscode.Selection(newPosition, newPosition);
                console.log('Cursor drifted to:', newPosition);
            }
        }
    });
}
