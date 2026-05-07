export function Help() {
  return (
    <div className="h-full overflow-y-auto bg-bg p-6 sm:p-10">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="space-y-4 pb-8 border-b border-border">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Documentation</h1>
          <p className="text-text-secondary leading-relaxed">
            PlainPlan is a local-first task manager. No cloud services, no tracking, and no external servers. All data remains on your physical disk.
          </p>
        </div>

        {/* Usage Section */}
        <section className="space-y-8">
          <h2 className="text-xl font-bold text-text-primary">Usage</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-md font-bold text-text-primary">Create a plan</h3>
              <ol className="list-decimal pl-5 text-sm text-text-secondary space-y-2">
                <li>Launch the app and click "Create a Plan".</li>
                <li>Select a folder on your computer using the directory picker.</li>
                <li>A directory named <code>PlainPlan</code> will be created to store your data.</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-md font-bold text-text-primary">Add a task</h3>
              <ol className="list-decimal pl-5 text-sm text-text-secondary space-y-2">
                <li>Click the "+" button in the header or sidebar.</li>
                <li>Or press <code>N</code> on your keyboard for quick entry.</li>
                <li>Fill in the fields and click "Create". Success writes directly to your local file.</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-md font-bold text-text-primary">Kanban and table</h3>
              <p className="text-sm text-text-secondary">
                Toggle between view types in the sidebar. <strong>Board</strong> view is for visual tracking; <strong>Table</strong> view is optimized for bulk data management.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-md font-bold text-text-primary">Customize task fields</h3>
              <p className="text-sm text-text-secondary">
                Go to <strong>Settings</strong> to define custom metadata (dropdowns, text, numbers). These are stored in <code>metadata.json</code> and apply to all tasks in the plan.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <h2 className="text-xl font-bold text-text-primary">FAQ</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="font-bold text-text-primary text-sm">Where is my plan stored?</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                In the folder you picked during setup. It is located at <code>PlainPlan/plan.json</code> (tasks) and <code>PlainPlan/metadata.json</code> (configuration).
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-text-primary text-sm">Can I track my plan with Git or cloud services?</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Yes. Since the data is stored in standard JSON format, you can initialize a Git repository in the plan folder or save the plan inside a Dropbox, iCloud, or Google Drive folder for syncing.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-text-primary text-sm">Can I share my plan and collaborate with others?</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Yes. Multiple users can edit the same plan if they have shared access to the filesystem (e.g., via a shared cloud folder or Git).
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-text-primary text-sm">How do I make plans with AI?</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                PlainPlan does not have built-in AI. You can generate task lists using external AI tools and manually append the JSON structure to your <code>plan.json</code>.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="space-y-8 pb-12">
          <h2 className="text-xl font-bold text-text-primary">About</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-text-primary">Source Code</span>
              <a href="https://github.com/mh-wong/plainplan" target="_blank" rel="noreferrer" className="text-accent hover:underline">github.com/mh-wong/plainplan</a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-text-primary">Suggestions</span>
              <a href="https://github.com/mh-wong/plainplan/issues" target="_blank" rel="noreferrer" className="text-accent hover:underline">Report an issue</a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-text-primary">License</span>
              <span className="text-text-secondary">MIT License</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-text-primary">Developer</span>
              <span className="text-text-secondary">MH Wong</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-text-primary">Sponsor Me</span>
              <a href="https://github.com/sponsors/mh-wong" target="_blank" rel="noreferrer" className="text-accent hover:underline">Support on GitHub</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
