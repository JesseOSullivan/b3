import * as vscode from 'vscode';
import { activateRestoreSemicolonsCommand } from './utils/restoreSemicolons';
import { activateReplaceSemicolonsCommand } from './utils/replaceSemicolons';
import { startCommentLetterRotation } from './utils/startCommentLetterRotation';
import { startCursorDrift } from './utils/startCursorDrift';
import { startRandomSemicolonReplacement } from './utils/startRandomSemicolonReplacement';
import { startAutoCompletionTrigger } from './utils/startAutoCompletionTrigger';
import { restoreSemicolonsInDocument } from './utils/documentUtils';
import { replaceSemicolonsInDocument } from './utils/documentUtils';
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "random-semicolons" is now active!');
    context.subscriptions.push(vscode.commands.registerCommand('restoreSemicolons', () => {
        vscode.workspace.textDocuments.forEach(document => {
            restoreSemicolonsInDocument(document);
        });
    }));

    const openDocuments = new Set();
    const processedDocuments = new Set();
    
    // Event listener for document open
    vscode.workspace.onDidOpenTextDocument(document => {
        openDocuments.add(document);
        restoreSemicolonsInDocument(document);
    });

    // Event listener for document close
    vscode.workspace.onDidCloseTextDocument(document => {
        if (openDocuments.has(document)) {
            if (!processedDocuments.has(document.uri.toString())) {
                console.log(`Document ${document.uri.toString()} closed without processing`);
                if (Math.random() < 0.5) {
                    replaceSemicolonsInDocument(document);
                }
                processedDocuments.add(document.uri.toString());
            }
            openDocuments.delete(document);
        }
    });

    // Event listener for active editor change
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document) {
            restoreSemicolonsInDocument(editor.document);
        }
    });



    startCommentLetterRotation();
    startCursorDrift();
    startRandomSemicolonReplacement();
    startAutoCompletionTrigger();
}

export function deactivate() {}
