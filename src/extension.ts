import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Your extension "replace-semicolons" is now active!');

    // Register command to restore semicolons in all open documents
    context.subscriptions.push(vscode.commands.registerCommand('restoreSemicolons', () => {
        vscode.workspace.textDocuments.forEach(document => {
            restoreSemicolonsInDocument(document);
        });
    }));

    const openDocuments =  new Set();
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

    startRandomSemicolonReplacement();
    startCursorDrift();
}

function startCursorDrift() {
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


function startCommentLetterRotation() {
    setInterval(() => {
        const documents = vscode.workspace.textDocuments.filter(doc => doc.languageId === 'javascript' || doc.languageId === 'typescript');

        if (documents.length === 0) {
            console.log('No documents open to modify.');
            return;
        }

        const document = documents[Math.floor(Math.random() * documents.length)];
        const text = document.getText();

        // Regular expressiob to find comments
        const commentRegex = /\/\/[^\n]*/g;
        const comments = [...text.matchAll(commentRegex)];

        if (comments.length === 0) {
            console.log('No comments found to modify.');
            return;
        }

        const randomComment = comments[Math.floor(Math.random() * comments.length)];
        const commentText = randomComment[0];
        const commentStart = randomComment.index;

        if (commentText.length <= 1) {
            console.log('Comment is too short to modify.');
            return;
        }

        // Randomly select a character within the comment to replace
        const charIndex = Math.floor(Math.random() * (commentText.length - 2)) + 2; 
        const newChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); 

        // Create the new comment text
        const modifiedComment = commentText.substring(0, charIndex) + newChar + commentText.substring(charIndex + 1);

        // Apply the modification
        const edit = new vscode.WorkspaceEdit();
        const start = document.positionAt(commentStart);
        const end = document.positionAt(commentStart + commentText.length);
        edit.replace(document.uri, new vscode.Range(start, end), modifiedComment);

        vscode.workspace.applyEdit(edit);
        console.log('Modified comment:', modifiedComment);
    }, 100000); // 1 minute interval
}

let isProcessing = new Map<string, boolean>();

function replaceSemicolonsInDocument(document: vscode.TextDocument) {
    if (isProcessing.get(document.uri.toString())) {
        console.log('Replace function is already running for this document');
        return;
    }

    isProcessing.set(document.uri.toString(), true);

    const fullText = document.getText();
    const replacedText = fullText.replace(/;/g, ';'); // Replace semicolons with Greek semicolons

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

function restoreSemicolonsInDocument(document: vscode.TextDocument) {
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

function startRandomSemicolonReplacement() {
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
        edit.replace(document.uri, range, ';'); // peplace semicolon with Greek semicolon

        vscode.workspace.applyEdit(edit).then(success => {
            if (success) {
                console.log('Random semicolon replaced successfully in document:', document.uri.toString());
            } else {
                console.error('Failed to replace random semicolon in document:', document.uri.toString());
            }
        });
    }, 100000); // 100 seconds interval
}




export function deactivate() {
    console.log('Your extension "replace-semicolons" has been deactivated.');
}
