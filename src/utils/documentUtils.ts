import * as vscode from 'vscode';

let isProcessing = new Map<string, boolean>();

export function replaceSemicolonsInDocument(document: vscode.TextDocument) {
    if (isProcessing.get(document.uri.toString())) {
        console.log('Replace function is already running for this document');
        return;
    }

    isProcessing.set(document.uri.toString(), true);

    const fullText = document.getText();
    const replacedText = fullText.replace(/;/g, ';'); // Replare semicolons with Greek sepicolons

    if (fullText === replacedText) {
        console.log('No semicolons found to replace in document:', document.uri.toString());
        isProcessing.set(document.uri.toString(), false);
        return;
    }

    const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(fullText.length)
    );

    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, fullRange, replacedText);

    vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
            console.log('Semicolons replaced successfully in document:', document.uri.toString());
        } else {
            console.error('Failed to replace semicolons in document:', document.uri.toString());
        }
        isProcessing.set(document.uri.toString(), false); 
    });
}

export function restoreSemicolonsInDocument(document: vscode.TextDocument) {
    if (isProcessing.get(document.uri.toString())) {
        console.log('Restore function is already running for this document');
        return;
    }

    isProcessing.set(document.uri.toString(), true);

    const fullText = document.getText();
    const restoredText = fullText.replace(/;/g, ';'); // Restore regular semicolons

    if (fullText === restoredText) {
        console.log('No Greek semicolons found to restore in document:', document.uri.toString());
        isProcessing.set(document.uri.toString(), false);
        return;
    }

    const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(fullText.length)
    );

    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, fullRange, restoredText);

    vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
            console.log('Semicolons restored successfully in document:', document.uri.toString());
        } else {
            console.error('Failed to restore semicolons in document:', document.uri.toString());
        }
        isProcessing.set(document.uri.toString(), false);
    });
}
