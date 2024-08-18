import * as vscode from 'vscode';
import { replaceSemicolonsInDocument } from './documentUtils';

export function activateReplaceSemicolonsCommand(context: vscode.ExtensionContext) {
    const processedDocuments = new Set();
    const openDocuments = new Set();

    vscode.workspace.onDidOpenTextDocument(document => {
        openDocuments.add(document);
        replaceSemicolonsInDocument(document);
    });

    vscode.workspace.onDidCloseTextDocument(document => {
        if (openDocuments.has(document)) {
            if (!processedDocuments.has(document.uri.toString())) {
                    replaceSemicolonsInDocument(document);
                processedDocuments.add(document.uri.toString());
            }
            openDocuments.delete(document);
        }
    });
}
