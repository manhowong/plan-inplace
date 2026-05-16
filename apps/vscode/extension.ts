import * as vscode from 'vscode';
import { Sidebar } from './Sidebar';
import { MainView } from './MainView';

/**
 * Extension Activation Entry Point
 * 
 * This function initializes the VS Code extension by registering the
 * custom sidebar provider and the open command.
 */
export function activate(context: vscode.ExtensionContext) {
  const sidebar = new Sidebar(context.extensionUri, (planId?: string) => {
    MainView.createOrShow(context.extensionUri, planId);
  });

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(Sidebar.viewType, sidebar)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('plan-inplace.open', (planId?: string) => {
      MainView.createOrShow(context.extensionUri, planId);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('plan-inplace.openMarketplace', async () => {
      await vscode.commands.executeCommand('extension.open', 'manho-wong.plan-inplace');
    })
  );
}
