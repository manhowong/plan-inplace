export function getSidebarTemplate(nonce: string): string {
  return `<!DOCTYPE html>
 			<html lang="en">
 			<head>
 				<meta charset="UTF-8">
 				<meta name="viewport" content="width=device-width, initial-scale=1.0">
 				<title>Plan InPlace</title>
        <style>
          :root {
            --row-height: 24px;
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
            font-size: 13px;
            opacity: 0.9;
          }
          .title-subtitle {
            font-size: 11px; 
            opacity: 0.5;
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
          .input-hint {
            position: absolute;
            right: 30px; 
            opacity: 0.5; 
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
          select {
            width: 100%;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            padding: 4px 8px;
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
            // background-color: var(--vscode-list-hoverBackground);
            display: flex;
            align-items: center;
            padding: 0 8px;
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
            gap: 2px;
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
            gap: 8px;
            margin-right: 8px;
          }
          .section-content {
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-gutter: stable;
            flex: 1;
            scrollbar-width: thin;
            scrollbar-color: var(--vscode-scrollbarSlider-background) transparent;
          }
          .section.collapsed .section-content {
            display: none;
          }
          .task-item {
            height: var(--row-height);
            display: flex;
            align-items: center;
            padding: 0 var(--padding-side);
            padding-right: 2px;
            gap: 8px;
          }
          .task-item:hover {
            background-color: var(--vscode-list-hoverBackground);
            width: calc(100% - 14px);
            padding-right: 14px;
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
          .task-btn-left {
            display: flex;
          }
          .task-btn-left:hover + .task-title {
            text-decoration: line-through;
          }
          .clickable-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0.6;
          }
          .clickable-icon:hover {
            opacity: 1;
          }
          .clickable-icon.danger:hover {
            color: var(--vscode-errorForeground);
          }
          .clickable-icon.success:hover {
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
          .section-arrow svg { stroke-width: 1; }
          .icon-sm { width: 12px; height: 12px; }
          .icon-md { width: 14px; height: 16px; }
          .icon-lg { width: 18px; height: 18px; }
          
          .tooltip-wrapper {
            position: relative;
            display: inline-block;
          }
          .tooltip-text {
            visibility: hidden;
            position: absolute;
            top: 50%;
            right: calc(100% + 4px);
            transform: translateY(-50%);
            background-color: var(--vscode-editorHoverWidget-background);
            border: 2px solid var(--vscode-editorHoverWidget-border);
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 3px;
            white-space: nowrap;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
          }
          .task-btn-left .tooltip-text {
            right: auto;
            left: calc(100% + 4px);
            top: 150%;
          }
          .task-btn-right {
            border: 1px solid var(--vscode-input-border);
            border-radius: 6px;
            width: 1.2em;
            padding: 2px;
            color: var(--vscode-input-foreground);
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
          }
          .task-btn-right:hover {
            background-color: var(--vscode-input-background);
          }
          .tooltip-wrapper:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
          }
          .advanced-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .field-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .field-group label {
            font-size: 11px;
            opacity: 0.75;
          }
          select {
            font-size: 13px;
            opacity: 0.85;
            padding: 4px; 
          }
          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 999px;
            display: inline-block;
          }
          .menu {
            position: fixed;
            z-index: 9999;
            min-width: fit-content;
            background: var(--vscode-menu-background);
            color: var(--vscode-menu-foreground);
            border: 1px solid var(--vscode-menu-border);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            border-radius: 4px;
            padding: 4px;
            white-space: nowrap;
          }
          .menu-title {
            font-size: 11px;
            opacity: 0.7;
            padding: 4px 8px;
          }
          .menu-item {
            width: 100%;
            border: none;
            background: transparent;
            color: inherit;
            text-align: left;
            vertical-align: center;
            padding: 6px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 6px;
            direction: ltr;
          }
          .menu-item:hover {
            background: var(--vscode-list-hoverBackground);
          }
          .menu-check {
            width: 12px;
            line-height: 12px;
            text-align: center;
            font-size: 30px;
            opacity: 0.9;
          }

        </style>
 			</head>
 			<body>
 				<div id="content"></div>
          <div id="menuHost"></div>
 				<script nonce="${nonce}">
/* -------------------------------------------------------------------------- */
/* Webview Logic: Script Entry Point                                       */
/* -------------------------------------------------------------------------- */

 					const vscode = acquireVsCodeApi();
          const savedState = vscode.getState() || {};
          let currentData = {};
          let searchTerm = '';
          let feedbackMessage = '';
          let collapsedSections = { archived: true, active: false };
          let addOptionsOpen = false;
          let selectedPriority = 'Unassigned';
          let selectedStatus = '';
          let tagMode = savedState.tagMode || 'priority'; // priority | status
          let sortMode = savedState.sortMode || 'none'; // none | asc | desc
          let addTaskDraft = savedState.addTaskDraft || '';
          let hasMountedPlanUI = false;
          let openMenuKey = '';
          const lucideIcons = {
            external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
            map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
            pen: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',            plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
            return: '<polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>',
            more: '<circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>',
            check: '<polyline points="20 6 9 17 4 12"/>',
            trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
            arrow: '<polyline points="6 9 12 15 18 9"/>',
            filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
            archiveRestore: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="m9 15 3-3 3 3"/><path d="M12 12v9"/>',
            tag: '<path d="M20 12V4a1 1 0 0 0-1-1h-8L3 11l10 10 8-8z"/><circle cx="15" cy="8" r="1"/>',
            sortNone: '<path d="M4 7h10"/><path d="M4 12h14"/><path d="M4 17h18"/>',
            sortAsc: '<path d="M8 18V6"/><path d="m5 9 3-3 3 3"/><path d="M14 18h6"/><path d="M14 14h4"/><path d="M14 10h2"/>',
            sortDesc: '<path d="M8 6v12"/><path d="m5 15 3 3 3-3"/><path d="M14 10h6"/><path d="M14 14h4"/><path d="M14 18h2"/>'
          };
          function getIcon(name, className = "icon-sm") {
            return \`<svg class="\${className}" viewBox="0 0 24 24">\${lucideIcons[name]}</svg>\`;
          }
          function persistState() {
            vscode.setState({ tagMode, sortMode, addTaskDraft });
          }
          function escapeHtmlText(text) {
            return String(text || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
          }
          function getStatusField() {
            return (currentData.config && currentData.config.customFields || []).find(f => f.id === 'status');
          }
          function getStatusOptions() {
            const sf = getStatusField();
            return sf && Array.isArray(sf.options) ? sf.options : [];
          }
          function getStatusOption(id) {
            return getStatusOptions().find(o => o.id === id);
          }
          function getStatusColor(color) {
            const m = {
              slate: '#64748b', neutral: '#737373', red: '#ef4444', orange: '#f97316', amber: '#f59e0b',
              yellow: '#eab308', lime: '#84cc16', green: '#22c55e', emerald: '#10b981', teal: '#14b8a6',
              cyan: '#06b6d4', blue: '#3b82f6', indigo: '#6366f1', violet: '#8b5cf6', fuchsia: '#d946ef'
            };
            return m[color] || 'var(--vscode-descriptionForeground)';
          }
          function sortActive(tasks) {
            const byRank = [...tasks].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
            if (sortMode === 'none') return byRank;
            const dir = sortMode === 'asc' ? 1 : -1;
            if (tagMode === 'priority') {
              const p = { Unassigned: 0, Low: 1, Medium: 2, High: 3 };
              return byRank.sort((a, b) => ((p[a.priority] ?? -1) - (p[b.priority] ?? -1)) * dir);
            }
            const so = getStatusOptions().map(o => o.id);
            return byRank.sort((a, b) => (so.indexOf(a.status) - so.indexOf(b.status)) * dir);
          }
          function closeMenu() {
            document.getElementById('menuHost').innerHTML = '';
            document.removeEventListener('click', closeMenu);
            window.removeEventListener('blur', closeMenu);
            document.removeEventListener('visibilitychange', closeMenuOnHide);
            openMenuKey = '';
          }
          function closeMenuOnHide() {
            if (document.hidden) closeMenu();
          }
          function openMenu(anchor, html, key) {
            if (openMenuKey === key) {
              closeMenu();
              return;
            }
            const host = document.getElementById('menuHost');
            host.innerHTML = html;
            openMenuKey = key;
            const menu = host.firstElementChild;
            if (!menu) return;
            const r = anchor.getBoundingClientRect();
            const pad = 8, gap = 4;
            menu.style.visibility = 'hidden';
            menu.style.left = r.left + 'px';
            menu.style.top = (r.bottom + gap) + 'px';
            const mr = menu.getBoundingClientRect();
            let left = r.left;
            let top = r.bottom + gap;
            if (left + mr.width > window.innerWidth - pad) left = window.innerWidth - mr.width - pad;
            if (left < pad) left = pad;
            if (top + mr.height > window.innerHeight - pad) top = Math.max(pad, r.top - mr.height - gap);
            menu.style.left = left + 'px';
            menu.style.top = top + 'px';
            menu.style.visibility = 'visible';
            setTimeout(() => {
              document.addEventListener('click', closeMenu);
              window.addEventListener('blur', closeMenu);
              document.addEventListener('visibilitychange', closeMenuOnHide);
            }, 0);
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

            // No opened folder

            if (currentData.state === 'noWorkspace') {
              container.innerHTML = \`
                
                <div style="padding: 0 var(--padding-side); font-size: 13px; line-height: 1.5;">
                  <p>To use this <strong>sidebar</strong> for quick task management, open a folder: <br/>
                    [File > Open Folder...]
                  </p>
                  <p>To use the <strong>main interface</strong> for full features, press <strong>Open Full App</strong>.</p>
                  <button class="btn" onclick="openApp()">
                    <div class="btn-primary-text">\${getIcon('external')}Open Full App</div>
                    <div class="btn-secondary-text">Shift + Alt + P</div>
                  </button>
                </div>
              \`;
              return;
            }

            // No plan detected

            if (currentData.state === 'noPlan') {
              container.innerHTML = \`
                <div class="title-area">
                  <div class="title-row">No plan found in current directory</div>
                  <div class="title-subtitle">\${currentData.relativeLocation}</div>
                </div>

                <div style="padding: 0 var(--padding-side); font-size: 13px; line-height: 1.5;">
                  <h3>Quick Start</h3>                  
                  <strong>Step 1</strong>: Create a plan.<br/>
                  <strong>Step 2</strong>: Add tasks. That's it!<br/>
                  <p>Press "<strong>Create Plan</strong>" to create a plan in the <strong>current directory</strong>.<br/>
                    <span style="opacity: 0.7; font-size: 12px;">
                      This creates a "plan-inplace" folder to store the data.
                    </span>
                  </p>
                  <button class="btn" onclick="createPlan()"><div class="btn-primary-text">\${getIcon('map')}Create Plan</div></button>
                  \${feedbackMessage ? \`<div class="feedback-msg">\${feedbackMessage}</div>\` : ''}
                  <p style="padding-top:32px"><strong>Optional</strong>: Create plans anywhere via the full app.<p/>
                  <button class="btn" onclick="openApp()"><div class="btn-primary-text">\${getIcon('external')}Open Full App</div><div class="btn-secondary-text">Shift + Alt + P</div></button>
                </div>
              \`;
              return;
            }
            
            // Plan detected
            
            const tasks = currentData.tasks || [];
            const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
            const activeTasks = sortActive(filteredTasks.filter(t => !t.archived));
            const archivedTasks = filteredTasks.filter(t => t.archived);
            const statusOptions = getStatusOptions();
            if (!selectedStatus && statusOptions[0]) selectedStatus = statusOptions[0].id;
            if (selectedStatus && !statusOptions.find(o => o.id === selectedStatus)) selectedStatus = statusOptions[0] ? statusOptions[0].id : '';
            const activeEl = document.activeElement;
            const activeId = activeEl ? activeEl.id : null;
            const selectionStart = activeEl && 'selectionStart' in activeEl ? activeEl.selectionStart : null;
            const selectionEnd = activeEl && 'selectionEnd' in activeEl ? activeEl.selectionEnd : null;
            container.innerHTML = \`
              <div class="title-area">
                <div class="title-row">\${getIcon('map')}\${currentData.planName}</div>
                <div class="title-subtitle" style="margin-left:20px">Found in: <br/> \${currentData.relativeLocation}</div>
              </div>
              <div class="input-area">
                <div class="input-container add-input">
                  <div class="input-icon">\${getIcon('plus')}</div>
                  <input id="addTaskInput" type="text" value="\${escapeHtmlText(addTaskDraft)}" placeholder="Add a new task" oninput="updateAddTaskDraft(this.value)" onkeydown="if(event.key==='Enter')addTask(this)">
                  <div class="clickable-icon input-hint" onclick="addTask(this.previousElementSibling)">
                    \${getIcon('return', 'icon-md')} 
                  </div>
                  <div class="clickable-icon tooltip-wrapper">
                    <div style="opacity:0.7; margin-left: 0.5em; padding-top:4px;" onclick="toggleAddOptions(event)">
                      \${getIcon('more', 'icon-md')}
                    </div>
                    <span class="tooltip-text">Options</span>
                  </div>
                </div>
                \${addOptionsOpen ? \`<div class="advanced-row">
                    <div class="field-group">
                      <label>Priority</label>
                      <select onchange="setPriority(this.value)">
                        \${['Unassigned','High','Medium','Low'].map(p => \`<option value="\${p}" \${selectedPriority===p?'selected':''}>\${p}</option>\`).join('')}
                      </select>
                    </div>
                    <div class="field-group">
                      <label>Status</label>
                      <select onchange="setStatus(this.value, this)">
                        \${statusOptions.map(s => \`<option value="\${s.id}" \${selectedStatus===s.id?'selected':''}>\${escapeHtmlText(s.label)}</option>\`).join('')}
                        <option value="__edit_options__">Edit options...</option>
                      </select>
                    </div>
                  </div>\` : ''}
                <div class="input-container"><div class="input-icon">\${getIcon('filter')}</div><input id="filterInput" type="text" placeholder="Filter tasks" value="\${searchTerm}" oninput="search(this.value)"></div>
              </div>
              <div class="sections">

                <div class="section \${collapsedSections.active ? 'collapsed' : 'expanded'}">
                  <div class="section-header">
                    <div class="section-header-title" onclick="toggleSection('active')"><div class="section-arrow">\${getIcon('arrow', 'icon-lg')}</div>Active Tasks (\${activeTasks.length})</div>
                    <div class="section-actions">
                      <div class="tooltip-wrapper">
                        <div class="clickable-icon" onclick="showTagMenu(event)">\${getIcon('tag', 'icon-md')}</div>
                        <span class="tooltip-text">Show tag...</span>
                      </div>
                      <div class="tooltip-wrapper">
                        <div class="clickable-icon" onclick="toggleSort(event)">\${getIcon(sortMode==='none'?'sortNone':(sortMode==='asc'?'sortAsc':'sortDesc'), 'icon-md')}</div>
                        <span class="tooltip-text">\${sortMode==='none'?'Sort by...':(sortMode==='asc'?'Sort by tag (ascending)':'Sort by tag (descending)')}</span>
                      </div>
                    </div>
                  </div>
                  <div class="section-content">\${activeTasks.length === 0 ? '<div style="padding: 12px; font-size: 12px; opacity: 0.6; font-style: italic;">No active tasks</div>' : activeTasks.map(task => renderTask(task)).join('')}</div>
                </div>

                <div class="section \${collapsedSections.archived ? 'collapsed' : 'expanded'}">
                                    
                  <div class="section-header">
                    <div class="section-header-title" onclick="toggleSection('archived')">
                      <div class="section-arrow">\${getIcon('arrow', 'icon-lg')}</div>Archived (\${archivedTasks.length})
                    </div>
                    \${archivedTasks.length > 0 ? 
                      \`<div class="section-actions">
                          <div class="tooltip-wrapper">
                            <div class="clickable-icon danger" onclick="clearArchived(event)">\${getIcon('trash', 'icon-md')}</div>
                            <span class="tooltip-text">Delete all archived</span>
                          </div>
                        </div>\` : ''}
                  </div>
                  
                  <div class="section-content">
                    \${archivedTasks.length === 0 ? '<div style="padding: 12px; font-size: 12px; opacity: 0.6; font-style: italic;">No archived tasks</div>' : archivedTasks.map(task => renderTask(task)).join('')}
                  </div>
                </div>
              </div>

              <div class="footer">
                <button class="btn" onclick="openApp()"><div class="btn-primary-text">\${getIcon('external')}Open Full App</div><div class="btn-secondary-text">Shift + Alt + P</div></button>
              </div>
            \`;
            if (activeId) {
              const el = document.getElementById(activeId);
              if (el) {
                el.focus();
                if (typeof selectionStart === 'number' && el.setSelectionRange) {
                  el.setSelectionRange(selectionStart, selectionEnd || selectionStart);
                }
              }
            } else if (!hasMountedPlanUI) {
              hasMountedPlanUI = true;
              const addInput = document.getElementById('addTaskInput');
              if (addInput) addInput.focus();
            }
          }
          function renderTask(task) {
            if (task.archived) {
              return  \`<div class="task-item">
                          <div class="task-btn-left tooltip-wrapper">
                            <div class="clickable-icon success" onclick="toggleComplete(event, '\${task.id}')">\${getIcon('archiveRestore', 'icon-md')}</div>
                            <span class="tooltip-text">Restore</span>
                          </div>
                          <div class="task-title completed" title="\${escapeHtmlText(task.title)}">\${escapeHtmlText(task.title)}</div>
                          <div class="tooltip-wrapper" style="margin-right:4px;">
                            <div class="clickable-icon danger" onclick="deleteTask(event, '\${task.id}', '\${task.title}')">\${getIcon('trash', 'icon-md')}</div>
                            <span class="tooltip-text">Delete permanently</span>
                          </div>
                        </div>\`;
            }

            const priorityMap = { Unassigned: { letter: 'U', color: '#545454' }, High: { letter: 'H', color: '#ef4444' }, Medium: { letter: 'M', color: '#eab308' }, Low: { letter: 'L', color: '#2FA084' } };
            const p = priorityMap[task.priority] || priorityMap.Unassigned;
            const st = getStatusOption(task.status);
            const statusDot = \`<span class="status-dot" style="background:\${getStatusColor(st && st.color)}"></span>\`;
            const tagContent = tagMode === 'priority' ? \`<strong style="color:\${p.color}">\${p.letter}</strong>\` : statusDot;

            return  \`<div class="task-item">
                        <div class="task-btn-left tooltip-wrapper">
                          <div class="clickable-icon success" onclick="toggleComplete(event, '\${task.id}')">\${getIcon('check', 'icon-md')}</div>
                          <span class="tooltip-text">Complete</span>
                        </div>
                        <div class="task-title" title="\${escapeHtmlText(task.title)}">\${escapeHtmlText(task.title)}</div>
                        <div class="task-btn-right tooltip-wrapper">
                          <div onclick="showCategoryMenu(event, '\${task.id}')">\${tagContent}</div>
                          <span class="tooltip-text">\${tagMode === 'priority' ? ('Priority: ' + (task.priority || 'Unassigned')) : ('Status: ' + escapeHtmlText((st && st.label) || task.status || ''))}</span>
                        </div>
                        
                      </div>\`;
          }
          window.toggleSection = (name) => { collapsedSections[name] = !collapsedSections[name]; persistState(); render(); };
          window.search = (val) => { searchTerm = val; render(); };
          window.updateAddTaskDraft = (val) => { addTaskDraft = val; persistState(); };
          window.toggleAddOptions = (e) => { e.stopPropagation(); addOptionsOpen = !addOptionsOpen; persistState(); render(); };
          window.setPriority = (v) => { selectedPriority = v; persistState(); };
          window.setStatus = (v, el) => {
            if (v === '__edit_options__') {
              if (el) el.value = selectedStatus || '';
              vscode.postMessage({ type: 'openSettings' });
              return;
            }
            selectedStatus = v;
            persistState();
          };
          window.addTask = (input) => {
            const val = input.value.trim();
            if (val) {
              vscode.postMessage({ type: 'addTask', title: val, priority: selectedPriority, status: selectedStatus });
              addTaskDraft = '';
              persistState();
              input.value = '';
            }
          };
          window.toggleComplete = (e, id) => { e.stopPropagation(); vscode.postMessage({ type: 'completeTask', taskId: id }); };
          window.deleteTask = (e, id, title) => { e.stopPropagation(); vscode.postMessage({ type: 'deleteTask', taskId: id, title }); };
          window.toggleSort = (e) => {
            e.stopPropagation();
            sortMode = sortMode === 'none' ? 'asc' : (sortMode === 'asc' ? 'desc' : 'none');
            persistState();
            render();
          };
          window.showTagMenu = (e) => {
            e.stopPropagation();
            openMenu(e.currentTarget, \`<div class="menu">
              <button class="menu-item" onclick="setTagMode(event, 'priority')"><span class="menu-check">\${tagMode === 'priority' ? '•' : ''}</span>Show Priority</button>
              <button class="menu-item" onclick="setTagMode(event, 'status')"><span class="menu-check">\${tagMode === 'status' ? '•' : ''}</span>Show Status</button>
            </div>\`, 'show-tag-menu');
          };
          window.setTagMode = (e, mode) => { e.stopPropagation(); tagMode = mode; persistState(); closeMenu(); render(); };
          window.showCategoryMenu = (e, taskId) => {
            e.stopPropagation();
            const task = (currentData.tasks || []).find(t => t.id === taskId);
            if (!task) return;
            if (tagMode === 'priority') {
              const opts = ['Unassigned','High','Medium','Low'];
              openMenu(e.currentTarget, \`<div class="menu"><div class="menu-title">Change priority</div>\${opts.map(opt => \`<button type="button" class="menu-item" onclick="updateCategory(event, '\${taskId}', 'priority', '\${opt}')"><span class="menu-check">\${task.priority===opt?'•':''}</span>\${escapeHtmlText(opt)}</button>\`).join('')}</div>\`, 'task-tag-' + taskId);
              return;
            }
            const sopts = getStatusOptions();
            openMenu(e.currentTarget, \`<div class="menu"><div class="menu-title">Change status</div>\${sopts.map(opt => \`<button type="button" class="menu-item" onclick="updateCategory(event, '\${taskId}', 'status', '\${opt.id}')"><span class="menu-check">\${task.status===opt.id?'•':''}</span>\${escapeHtmlText(opt.label)}</button>\`).join('')}</div>\`, 'task-tag-' + taskId);
          };
          window.updateCategory = (e, taskId, field, value) => { e.stopPropagation(); closeMenu(); vscode.postMessage({ type: 'updateTaskField', taskId, field, value }); };
          window.clearArchived = (e) => { e.stopPropagation(); vscode.postMessage({ type: 'clearArchived' }); };
          window.createPlan = () => { vscode.postMessage({ type: 'createPlan' }); };
          window.openApp = () => { vscode.postMessage({ type: 'openApp' }); };
          window.openSettings = (e) => { if (e) e.stopPropagation(); vscode.postMessage({ type: 'openSettings' }); };
          vscode.postMessage({ type: 'refresh' });
 				</script>
 			</body>
 			</html>`;
}
