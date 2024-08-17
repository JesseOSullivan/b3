import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Your extension "replace-semicolons" is now active!');

    context.subscriptions.push(vscode.commands.registerCommand('restoreSemicolons', () => {
        vscode.workspace.textDocuments.forEach(document => {
            restoreSemicolonsInDocument(document);
        });
    }));

    const openDocuments = new Set<vscode.TextDocument>();
    const processedDocuments = new Set<string>(); 

    // Register event listeners for document open and close
    vscode.workspace.onDidOpenTextDocument(document => {
        openDocuments.add(document);
        restoreSemicolonsInDocument(document);
    });

    vscode.workspace.onDidCloseTextDocument(document => {
        if (openDocuments.has(document)) {
            if (!processedDocuments.has(document.uri.toString())) {
                console.log('Document closed without processing');
                replaceSemicolonsInDocument(document);
                processedDocuments.add(document.uri.toString());
            }
            openDocuments.delete(document);
        }
    });

    startRandomSemicolonReplacement();
}

let isProcessing = new Map<string, boolean>();

function replaceSemicolonsInDocument(document: vscode.TextDocument) {
    if (isProcessing.get(document.uri.toString())) {
        console.log('Function is already running for this document');
        return;
    }

    isProcessing.set(document.uri.toString(), true);

    const fullText = document.getText();
    const replacedText = fullText.replace(/;/g, ';'); // Replace semicolons with ';'

    const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(fullText.length)
    );

    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, fullRange, replacedText);

    vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
            console.log('Semicolons replaced successfully');
        } else {
            console.error('Failed to replace semicolons');
        }
        isProcessing.set(document.uri.toString(), false); 
    });
}

function restoreSemicolonsInDocument(document: vscode.TextDocument) {
    if (isProcessing.get(document.uri.toString())) {
        console.log('Function is already running for this document');
        return;
    }

    isProcessing.set(document.uri.toString(), true);

    const fullText = document.getText();
    const restoredText = fullText.replace(/;/g, ';'); // Restore semicolons

    const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(fullText.length)
    );

    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, fullRange, restoredText);

    vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
            console.log('Semicolons restored successfully');
        } else {
            console.error('Failed to restore semicolons');
        }
        isProcessing.set(document.uri.toString(), false);
    });
}

function startRandomSemicolonReplacement() {
    setInterval(async () => {
        const documents = vscode.workspace.textDocuments;

        if (documents.length === 0) {
            console.log('No documents open to modify.');
            return;
        }

        const document = documents[Math.floor(Math.random() * documents.length)];
        const fullText = document.getText();

        const semicolons = [...fullText.matchAll(/;/g)].map(match => match.index!);
        
        if (semicolons.length === 0) {
            console.log('No semicolons found in the document.');
            return;
        }

        // Select a random semicolon to replace
        const index = semicolons[Math.floor(Math.random() * semicolons.length)];
        const position = document.positionAt(index);

        const edit = new vscode.WorkspaceEdit();
        const range = new vscode.Range(position, position.translate(0, 1)); 
        edit.replace(document.uri, range, ';'); // Replace semicolon with Greek semicolon

        vscode.workspace.applyEdit(edit).then(success => {
            if (success) {
                console.log('Random semicolon replaced successfully.');
            } else {
                console.error('Failed to replace random semicolon.');
            }
        });
    }, 100000); 
}

export function deactivate() {}
