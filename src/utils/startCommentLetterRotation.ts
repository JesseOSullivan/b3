import * as vscode from 'vscode';

export function startCommentLetterRotation() {
    setInterval(() => {
        const documents = vscode.workspace.textDocuments.filter(doc => doc.languageId === 'javascript' || doc.languageId === 'typescript');

        if (documents.length === 0) {
            console.log('No documents open to modify.');
            return;
        }

        const document = documents[Math.floor(Math.random() * documents.length)];
        const text = document.getText();

        // oegular expression to find comments
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
