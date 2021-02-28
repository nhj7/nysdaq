const vscode = require("vscode")

context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(s => { 
    console.log(`terminated: ${s.type} ${s.name}`);
 }));