import {Info} from 'lucide-react';

export function Help() {
  return (
    <div className="h-full overflow-y-auto bg-bg p-6 sm:p-10">
      <div className="max-w-3xl space-y-12">

        {/* Header Section */}
        <div className="space-y-4 pb-8">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Help</h1>
          
          <div
            className="flex items-center gap-3 px-4 py-2 bg-priority-med/10 border border-priority-med/20 rounded-md text-priority-med text-base font-semibold"
          >
            <Info className="w-4 h-4 flex-shrink-0" />
            <strong>VS Code users</strong>: It may take a few seconds for the extension to activate upon VS Code startup. If the UI is unresponsive, please wait for activation to complete.
          </div>
          
          <p className="text-xl text-text-primary">
            <strong>Plan InPlace</strong> is a lightweight, open-source planner that keeps your plan and your project in one place, integrating project management into your agile workflow.
          </p>
          <p className="pl-5 text-xl text-text-primary">
            <strong>No setup</strong>: Create a plan instantly in your current workspace or selected location.<br/>
            <strong>Full data control</strong>: Keep data offline, or sync it with Git and your cloud drive.<br/>
            <strong>Git-native</strong>: Track and sync tasks along with your Git workflow.<br/>
            <strong>Flexible</strong>: Manage tasks quickly with the VS Code sidebar, or use advanced planning features with Kanban and more.<br/>
            <strong>AI-ready</strong>: Data is stored in standard JSON for easy LLM integration.
          </p>
        </div>

        {/* Installation Section */}
        <section className="space-y-10">
          <h2 className="text-2xl font-bold text-text-primary">Installation</h2>

          <div className="space-y-2">
            <ul className="list-disc pl-5 text-base text-text-secondary space-y-2">
              <li><strong>VS Code</strong>: Install from the VS Code Marketplace.</li>
              <li><strong>Web App</strong>: Access at <a href="https://planinplace.netlify.app/" className="underline">planinplace.netlify.app</a>.</li>
              <li>Both options allow for offline use.</li>
            </ul>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="space-y-10">
          <h2 className="text-2xl font-bold text-text-primary">How to Use</h2>

          <div className="space-y-10">

            <div className="space-y-4">
              <h3 className="text-base font-bold text-text-primary">Sidebar (VS Code)</h3>
              <p className="text-base text-text-secondary">Use the sidebar in VS Code for quick plan management.</p>
              <ul className="list-disc pl-5 text-base text-text-secondary space-y-2">
                <li>Click the <strong>Plan InPlace icon</strong> in the "Activity Bar" (left of window).</li>
                <li>Click <strong>Create a Plan</strong>. This initializes a new plan and creates a <code>plan-inplace</code> folder in the current workspace to store the plan.</li>
                <li><strong>Add, archive, or delete tasks</strong> directly from the sidebar.</li>
                <li><strong>Auto-load</strong>: Loads your plan automatically when you open the workspace.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-text-primary">Launch the interface in VS Code</h3>
              <p className="text-base text-text-secondary">3 ways to launch the full interface:</p>
              <ul className="list-disc pl-5 text-base text-text-secondary space-y-2">
                <li><strong>Keyboard Shortcut</strong>: <code>Shift+Alt+P</code></li>
                <li><strong>Command Palette</strong>: <code>&gt;Plan InPlace: Open Plan InPlace App</code></li>
                <li><strong>VS Code Sidebar</strong>: Open Plan InPlace Sidebar &gt; Click <strong>Open Full App</strong>.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-text-primary">Create or open a plan</h3>
              <p className="text-base text-text-secondary">You can create or open a plan <strong>anywhere on your machine</strong>:</p>
              <ul className="list-disc pl-5 text-base text-text-secondary space-y-2">
                <li>Click <strong>Create a Plan</strong> &gt; select a location. This initializes a new plan and creates a <code>plan-inplace</code> folder in the selected location.</li>
                <li>Click <strong>Open a Plan</strong> &gt; select a <code>plan-inplace</code> folder (or a project folder containing a <code>plan-inplace</code> folder).</li>
              </ul>
              <p className="text-base text-text-secondary">Viewed plans are added to the <strong>Recent Plans</strong> list for easy access.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-text-primary">Add a task</h3>
              <ol className="list-decimal pl-5 text-base text-text-secondary space-y-2">
                <li>Go to <strong>Active Tasks</strong>.</li>
                <li>Add a task via 3 options:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Quick add</strong> input in the header.</li>
                    <li><strong>Details</strong> button in the header.</li>
                    <li><strong>Plus icon</strong> in Board view (Kanban).</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">Customize task fields</h3>
              <p className="text-base text-text-secondary">
                Each task has these default fields: <strong><code>Title</code>, <code>Notes</code>, <code>Tags</code>, <code>Status</code>, <code>Priority</code>, <code>Due Date</code></strong>.
              </p>
              <p className="text-base text-text-secondary">
                You can customize <strong><code>Status</code></strong> options or add more fields in <strong>Plan Settings</strong>.
              </p>
              <p className="text-base text-text-secondary">
                Customized task fields only apply to one plan. To use the same settings from another plan, click <strong>Import from Another Plan...</strong>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">View modes</h3>
              <p className="text-base text-text-secondary">
                Toggle between Board (Kanban) and Table views in the app sidebar.
              </p>
              <p className="text-base text-text-secondary">Advanced settings:</p>
              <ul className="list-disc pl-5 text-base text-text-secondary space-y-2">
                <li><strong>Board Settings</strong>: Toggle between grouping by task status (Classical Kanban) or by task priority. (To customize status order and options, see Plan Settings.)</li>
                <li><strong>Table Settings</strong>: Customize column order and visibility.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-10">
          <h2 className="text-2xl font-bold text-text-primary">FAQ</h2>
          
          <div className="space-y-10">
            <div className="space-y-2">
              <p className="font-bold text-text-primary text-base">Where is my plan stored?</p>
              <p className="text-base text-text-secondary leading-relaxed">
                It is stored in standard JSON in your current workspace or selected location:
              </p>
              <ul className="list-disc pl-5 text-base text-text-secondary space-y-1">
                <li><code>/plan-inplace/plan.json</code> (plan details, e.g. tasks)</li>
                <li><code>/plan-inplace/metadata.json</code> (configurations)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-text-primary text-base">Can I move the <code>plan-inplace</code> folder?</p>
              <p className="text-base text-text-secondary leading-relaxed">
                Yes. You can move it anywhere. If the app loses the link, just click <strong>Open a Plan</strong> and select the folder in its new location to restore it to the Recent Plans list.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-text-primary text-base">Can I track my plan with Git or Cloud services?</p>
              <p className="text-base text-text-secondary leading-relaxed">
                Yes. The data (JSON) structure is designed for easy versioning and conflict resolution. Commit the folder to Git for versioning, or store it in a synced folder (Dropbox, OneDrive, etc.) for cross-device access.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-text-primary text-base">Can I collaborate with others?</p>
              <p className="text-base text-text-secondary leading-relaxed">
                Yes. The app allows for concurrent file access. Simply store the plan folder in a shared cloud drive. For asynchronous collaboration, commit it to your Git repository. Team members can pull, edit, and push changes just like code.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="space-y-10 pb-12">
          <h2 className="text-2xl font-bold text-text-primary">About</h2>

          <div className="space-y-2">
            <ul className="list-disc pl-5 text-base text-text-secondary space-y-2">
              <li><strong>Source</strong>: <a href="https://github.com/manhowong/plan-inplace" className="underline">GitHub</a></li>
              <li><strong>License</strong>: <a href="https://github.com/manhowong/plan-inplace/blob/main/LICENSE" className="underline">Apache License 2.0</a></li>
              <li><strong>Developer</strong>: <a href="https://github.com/manhowong" className="underline">@manhowong</a></li>
              <li><strong>Support</strong>:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><a href="https://github.com/manhowong/plan-inplace/issues/new?template=become-a-contributor.md" className="underline">Pull request</a></li>
                  <li><a href="https://github.com/manhowong/plan-inplace/issues/new" className="underline">Report an Issue</a></li>
                  <li><a href="https://github.com/sponsors/manhowong" className="underline">Sponsor on GitHub ♥</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}