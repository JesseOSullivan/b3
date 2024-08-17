import * as vscode from 'vscode';

export function startRandomSemicolonReplacement() {
    setInterval(() => {
        const documents = vscode.workspace.textDocuments;

        if (documents.length === 0) {
            console.log('No documents open to modify.');
            return;
        }

        const activeEditor = vscode.window.activeTextEditor;

        const eligibleDocuments = documents.filter(doc => !activeEditor || doc.uri.toString() !== activeEditor.document.uri.toString());

        if (eligibleDocuments.length === 0) {
            console.log('No eligible documents to modify.');
            return;
        }

        const document = eligibleDocuments[Math.floor(Math.random() * eligibleDocuments.length)];
        const fullText = document.getText();

        const semicolonPositions = [];
        for (let i = 0; i < fullText.length; i++) {
            if (fullText[i] === ';') {
                semicolonPositions.push(i);
            }
        }

        if (semicolonPositions.length === 0) {
            console.log('No semicolons found in the document:', document.uri.toString());
            return;
        }

        // Select a random semicolon to replace
        const index = semicolonPositions[Math.floor(Math.random() * semicolonPositions.length)];
        const position = document.positionAt(index);

        const edit = new vscode.WorkspaceEdit();
        const range = new vscode.Range(position, position.translate(0, 1)); 
        edit.replace(document.uri, range, ';'); // replace semicolon with Greek semicolon

        vscode.workspace.applyEdit(edit).then(success => {
            if (success) {
                console.log('Random semicolon replaced successfully in document:', document.uri.toString());
            } else {
                console.error('Failed to replace random semicolon in document:', document.uri.toString());
            }
        });
    }, 100000); 
}
