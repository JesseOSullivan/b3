import * as vscode from 'vscode';

export function startAutoCompletionTrigger() {
    setInterval(() => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            vscode.commands.executeCommand('editor.action.triggerSuggest');
            console.log('Triggered auto-completion suggestions');
        }
    }, 3 * 60000); // 3 minute interval
}
