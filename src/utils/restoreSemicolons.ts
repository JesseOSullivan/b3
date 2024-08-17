import * as vscode from 'vscode';
import { restoreSemicolonsInDocument } from './documentUtils';

export function activateRestoreSemicolonsCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('restoreSemicolons', () => {
        vscode.workspace.textDocuments.forEach(document => {
            restoreSemicolonsInDocument(document);
        });
    }));
}
