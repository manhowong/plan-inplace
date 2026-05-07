export function getSidebarTemplate(nonce: string): string {
  return `<!DOCTYPE html>
 			<html lang="en">
 			<head>
 				<meta charset="UTF-8">
 				<meta name="viewport" content="width=device-width, initial-scale=1.0">
 				<title>Plan InPlace</title>
        <style>
          :root {
            --row-height: 28px;
            --header-height: 24px;
            --font-size: 13px;
            --padding-side: 12px;
          }
          body {
            background: transparent;
            color: var(--vscode-foreground);
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            padding: 0;
            margin: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            user-select: none;
          }
          #content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .title-area {
            padding: 12px var(--padding-side) 8px var(--padding-side);
            flex-shrink: 0;
            border-bottom: 1px solid var(--vscode-sideBarSectionHeader-border);
          }
          .title-row {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            font-size: 13px;
            opacity: 0.9;
          }
          .title-subtitle {
            font-size: 12px;
            opacity: 0.6;
            margin-left: 22px;
            margin-top: 2px;
          }
          .input-area {
            padding: 12px var(--padding-side);
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex-shrink: 0;
            border-bottom: 1px solid var(--vscode-sideBarSectionHeader-border);
          }
          .input-container {
            position: relative;
            display: flex;
            align-items: center;
          }
          .input-icon {
            position: absolute;
            left: 8px;
            opacity: 0.5;
            display: flex;
            pointer-events: none;
          }
          .input-shortcut {
            position: absolute;
            right: 8px;
            opacity: 0.5;
            pointer-events: none;
            display: flex;
          }
          input {
            width: 100%;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            padding: 4px 28px;
            border-radius: 4px;
            outline: none;
            font-family: inherit;
            font-size: 13px;
          }
          input:focus {
            border-color: var(--vscode-focusBorder);
          }
          #addTaskInput::placeholder {
            color: var(--vscode-input-foreground);
            opacity: 0.85;
          }
          .sections {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .section {
            display: flex;
            flex-direction: column;
            min-height: 0;
            border-bottom: 1px solid var(--vscode-sideBarSectionHeader-border);
          }
          .section.expanded {
            flex: 1;
          }
          .section-header {
            height: var(--header-height);
            background-color: var(--vscode-sideBarSectionHeader-background);
            display: flex;
            align-items: center;
            padding: 0 4px;
            cursor: pointer;
            flex-shrink: 0;
          }
          .section-header-title {
            flex: 1;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: flex;
            align-items: center;
            gap: 4px;
            opacity: 0.7;
          }
          .section-arrow {
            transition: transform 0.1s;
            opacity: 0.8;
            display: flex;
          }
          .section.collapsed .section-arrow {
            transform: rotate(-90deg);
          }
          .section-actions {
            display: flex;
            gap: 2px;
            padding-right: 4px;
          }
          .section-content {
            overflow-y: auto;
            flex: 1;
          }
          .section.collapsed .section-content {
            display: none;
          }
          .task-item {
            height: var(--row-height);
            display: flex;
            align-items: center;
            padding: 0 var(--padding-side);
            cursor: pointer;
            gap: 8px;
          }
          .task-item:hover {
            background-color: var(--vscode-list-hoverBackground);
          }
          .task-title {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 13px;
          }
          .task-title.completed {
            text-decoration: line-through;
            opacity: 0.4;
            font-style: italic;
          }
          .task-actions {
            display: flex;
            opacity: 0;
          }
          .task-item:hover .task-actions {
            opacity: 1;
          }
          .icon-btn {
            padding: 2px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0.6;
          }
          .icon-btn:hover {
            opacity: 1;
            background-color: var(--vscode-toolbar-hoverBackground);
          }
          .icon-btn.danger:hover {
            color: var(--vscode-errorForeground);
          }
          .icon-btn.success:hover {
            color: var(--vscode-testing-iconPassed);
          }
          .footer {
            padding: 16px var(--padding-side);
            flex-shrink: 0;
            border-top: 1px solid var(--vscode-sideBarSectionHeader-border);
          }
          .btn {
            width: 100%;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .btn:hover {
            background: var(--vscode-button-hoverBackground);
          }
          .btn-primary-text {
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .btn-secondary-text {
            font-size: 10px;
            opacity: 0.6;
            margin-top: 2px;
          }
          .feedback-msg {
            padding: 8px var(--padding-side);
            font-size: 11px;
            color: var(--vscode-testing-iconPassed);
            background: var(--vscode-textBlockQuote-background);
            border-left: 2px solid var(--vscode-testing-iconPassed);
            margin: 0 var(--padding-side) 12px var(--padding-side);
          }
          svg { stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
          .icon-sm { width: 12px; height: 12px; }
        </style>
 			</head>
 			<body>
 				<div id="content"></div>
 				<script nonce="${nonce}">
/* -------------------------------------------------------------------------- */
/* Webview Logic: Script Entry Point                                       */
/* -------------------------------------------------------------------------- */

 					const vscode = acquireVsCodeApi();
          let currentData = {};
          let searchTerm = '';
          let feedbackMessage = '';
          let collapsedSections = { archived: true };
          const lucideIcons = {
            external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
            map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
            plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
            return: '<polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>',
            check: '<polyline points="20 6 9 17 4 12"/>',
            trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
            arrow: '<polyline points="6 9 12 15 18 9"/>',
            archive: '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>',
            filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
            briefcase: '<rect width="20" height="14" x="2" y="6" rx="2"/><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/>',
            archiveRestore: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="m9 15 3-3 3 3"/><path d="M12 12v9"/>'
          };
          function getIcon(name, className = "icon-sm") {
            return \`<svg class="\${className}" viewBox="0 0 24 24">\${lucideIcons[name]}</svg>\`;
          }
          window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'setData') {
              currentData = message;
              render();
            } else if (message.type === 'planCreated') {
              feedbackMessage = message.message;
              render();
            }
          });
          function render() {
            const container = document.getElementById('content');
            if (currentData.state === 'noWorkspace') {
              container.innerHTML = \`
                <div class="title-area"><div class="title-row">Start Planning...</div></div>
                <div style="padding: 0 var(--padding-side); opacity: 0.8; font-size: 13px; line-height: 1.5;">
                  <p>To add a plan to your project, open the full app.</p>
                  <p style="margin-top: 12px; opacity: 0.7; font-size: 12px;">If you've already created a plan in your project's directory, open the directory in VS Code [File > Open Folder...]. You will see the plan appear here.</p>
                </div>
                <div class="footer"><button class="btn" onclick="openApp()"><div class="btn-primary-text">\${getIcon('external')}Open Full App</div><div class="btn-secondary-text">Shift + Alt + P</div></button></div>
              \`;
              return;
            }
            if (currentData.state === 'noPlan') {
              container.innerHTML = \`
                <div class="title-area"><div class="title-row">No plan found in current directory</div></div>
                <div style="padding: 0 var(--padding-side); opacity: 0.8; font-size: 13px; line-height: 1.5;">
                  <h3>Creating Plans</h3>
                  <p>To create a plan in <i>this directory</i>, press "<b>Create a Plan</b>".</p>
                  <p>You can also create a plan <i>elsewhere</i> via the app UI.</p>
                  <p style="margin-top: 12px; opacity: 0.7; font-size: 12px;">A folder ("plan-inplace") will be created in the selected directory to store the plan.</p>
                  <h3>Managing Tasks</h3>
                  You can manage tasks here (if a plan exists in the current directory), or use the app UI for advanced features.
                </div>
                \${feedbackMessage ? \`<div class="feedback-msg">\${feedbackMessage}</div>\` : ''}
                <div class="input-area" style="gap: 12px;">
                  <button class="btn" onclick="createPlan()"><div class="btn-primary-text">\${getIcon('map')}Create a Plan</div></button>
                  <button class="btn" onclick="openApp()"><div class="btn-primary-text">\${getIcon('external')}Open Full App</div><div class="btn-secondary-text">Shift + Alt + P</div></button>
                </div>
              \`;
              return;
            }
            const tasks = currentData.tasks || [];
            const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
            const activeTasks = filteredTasks.filter(t => !t.archived);
            const archivedTasks = filteredTasks.filter(t => t.archived);
            const activeEl = document.activeElement;
            const activeId = activeEl ? activeEl.id : null;
            const selectionStart = activeEl && 'selectionStart' in activeEl ? activeEl.selectionStart : null;
            const selectionEnd = activeEl && 'selectionEnd' in activeEl ? activeEl.selectionEnd : null;
            container.innerHTML = \`
              <div class="title-area">
                <div class="title-row">\${getIcon('map')}\${currentData.planName}</div>
                <div class="title-subtitle" style="font-size: 11px; opacity: 0.5;">Parent Directory: <br/> \${currentData.relativeLocation}</div>
              </div>
              <div class="input-area">
                <div class="input-container add-input"><div class="input-icon">\${getIcon('plus')}</div><input id="addTaskInput" type="text" placeholder="Add a task" onkeydown="if(event.key==='Enter')addTask(this)"><div class="input-shortcut">\${getIcon('return', 'icon-sm')}</div></div>
                <div class="input-container"><div class="input-icon">\${getIcon('filter')}</div><input id="filterInput" type="text" placeholder="Filter tasks" value="\${searchTerm}" oninput="search(this.value)"></div>
              </div>
              <div class="sections">
                <div class="section \${collapsedSections.active ? 'collapsed' : 'expanded'}">
                  <div class="section-header" onclick="toggleSection('active')"><div class="section-header-title"><div class="section-arrow">\${getIcon('arrow', 'icon-sm')}</div>\${getIcon('briefcase', 'icon-sm')}Active Tasks (\${activeTasks.length})</div></div>
                  <div class="section-content">\${activeTasks.length === 0 ? '<div style="padding: 12px; font-size: 11px; opacity: 0.3; font-style: italic;">No active tasks</div>' : activeTasks.map(task => renderTask(task)).join('')}</div>
                </div>
                <div class="section \${collapsedSections.archived ? 'collapsed' : 'expanded'}">
                  <div class="section-header">
                    <div class="section-header-title" onclick="toggleSection('archived')"><div class="section-arrow">\${getIcon('arrow', 'icon-sm')}</div>\${getIcon('archive', 'icon-sm')}Archived (\${archivedTasks.length})</div>
                    \${archivedTasks.length > 0 ? \`<div class="section-actions"><div class="icon-btn danger" onclick="clearArchived(event)" title="Delete all archived">\${getIcon('trash', 'icon-sm')}</div></div>\` : ''}
                  </div>
                  <div class="section-content">\${archivedTasks.length === 0 ? '<div style="padding: 12px; font-size: 11px; opacity: 0.3; font-style: italic;">No archived tasks</div>' : archivedTasks.map(task => renderTask(task)).join('')}</div>
                </div>
              </div>
              <div class="footer"><button class="btn" onclick="openApp()"><div class="btn-primary-text">\${getIcon('external')}Open Full App</div><div class="btn-secondary-text">Shift + Alt + P</div></button></div>
            \`;
            if (activeId) {
              const el = document.getElementById(activeId);
              if (el) {
                el.focus();
                if (typeof selectionStart === 'number' && el.setSelectionRange) {
                  el.setSelectionRange(selectionStart, selectionEnd || selectionStart);
                }
              }
            } else {
              const addInput = document.getElementById('addTaskInput');
              if (addInput) addInput.focus();
            }
          }
          function renderTask(task) {
            return \`<div class="task-item" onclick="toggleComplete(event, '\${task.id}')"><div class="task-title \${task.archived ? 'completed' : ''}" title="\${task.title}">\${task.title}</div><div class="task-actions"><div class="icon-btn success" onclick="toggleComplete(event, '\${task.id}')" title="\${task.archived ? 'Restore' : 'Complete'}">\${task.archived ? getIcon('archiveRestore', 'icon-sm') : getIcon('check', 'icon-sm')}</div></div></div>\`;
          }
          window.toggleSection = (name) => { collapsedSections[name] = !collapsedSections[name]; render(); };
          window.search = (val) => { searchTerm = val; render(); };
          window.addTask = (input) => { if (input.value.trim()) { vscode.postMessage({ type: 'addTask', title: input.value.trim() }); input.value = ''; } };
          window.toggleComplete = (e, id) => { e.stopPropagation(); vscode.postMessage({ type: 'completeTask', taskId: id }); };
          window.clearArchived = (e) => { e.stopPropagation(); vscode.postMessage({ type: 'clearArchived' }); };
          window.createPlan = () => { vscode.postMessage({ type: 'createPlan' }); };
          window.openApp = () => { vscode.postMessage({ type: 'openApp' }); };
          vscode.postMessage({ type: 'refresh' });
 				</script>
 			</body>
 			</html>`;
}
