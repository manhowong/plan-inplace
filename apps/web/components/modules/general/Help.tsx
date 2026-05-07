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
            VS Code extension coming soon. Stay tuned :)
          </div>
          
          <p className="text-xl text-text-primary">
          <strong>Plan InPlace</strong> is a project planner that 
          allows you to create and manage <i>portable</i> plans: plans that live with individual projects or anywhere you like. 
          </p>
          <p className="pl-5 text-xl text-text-primary">
            <strong>No setup</strong>. Create a plan and add tasks quickly.<br/>
            Store data <strong>locally</strong> and <strong>track</strong> with Git, or sync with your cloud services.<br/>
            Manage tasks with <strong>Kanban, table, and more</strong>.
          </p>
        </div>

        {/* Usage Section */}
        <section className="space-y-10">
          <h2 className="text-2xl font-bold text-text-primary">Quick Start</h2>
          
          <div className="space-y-10">

            <div className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">Create a plan</h3>
              <ol className="list-decimal pl-5 text-base text-text-secondary space-y-2">
                <li>Click <strong>Create a Plan</strong>.</li>
                <li>Select a location on your computer (e.g., your project folder).</li>
                <li>A folder named <code>/plan-inplace</code> will be created to store your data.</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">Add a task</h3>
              <p className="list-decimal text-base text-text-secondary space-y-2">Go to <strong>Active Tasks</strong>, then:</p>
              <p className="pl-5 text-base text-text-secondary">
              (Option 1) Use the <strong>Quick add</strong> input in the header for fast entry.
              </p>
              <p className="pl-5 text-base text-text-secondary">
              (Option 2) Click <strong>Details</strong> in the header or the <strong>Plus</strong> icon in Board columns to open the full task dialog. Fill in the fields and click <strong>Add Task</strong>.
              </p>

            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">Kanban Board and Table views</h3>
              <p className="text-base text-text-secondary">
                Toggle between views in the sidebar.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">Customize task fields</h3>
              <p className="text-base text-text-secondary">
                Go to <strong>Plan Settings</strong> to define task metadata (e.g., add new fields). These are stored in <code>metadata.json</code> and apply to all tasks in the plan.
              </p>
              <p className="text-base text-text-secondary">
                To customize the order or visibility of table columns, or how tasks are grouped on Kanban, 
                go to <strong>Active Tasks</strong> and press <strong>Table Settings</strong> or <strong>Table Settings</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-10 pb-12">
          <h2 className="text-2xl font-bold text-text-primary">FAQ</h2>
          
          <div className="space-y-10">
            <div className="space-y-2">
              <p className="font-bold text-text-primary text-base">Where is my plan stored?</p>
              <p className="text-base text-text-secondary leading-relaxed">
                In the folder you picked during plan creation. 
                It is located at <code>/plan-inplace/plan.json</code> (tasks) and <code>/plan-inplace/metadata.json</code> (configuration).
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-text-primary text-base">Can I move the <code>/plan-inplace</code> folder?</p>
              <p className="text-base text-text-secondary leading-relaxed">
                Yes. You can move the folder to any location, 
                but the App won't know the folder's new location and you won't be able to open it from the Recent Plans list.<br/>
                Simply press <strong>Open a Plan</strong> to open it and add it back to the Recent Plans list.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-text-primary text-base">Can I track my plan with Git or cloud services?</p>
              <p className="text-base text-text-secondary leading-relaxed">
                Yes. Since the data is stored in standard JSON format, 
                you can initialize a Git repository in the plan folder or 
                save the plan inside a cloud folder (e.g., Google Drive) for syncing.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-text-primary text-base">Can I share my plan and collaborate with others?</p>
              <p className="text-base text-text-secondary leading-relaxed">
                Yes. Multiple users can edit the same plan if they have shared access to the filesystem (e.g., via a shared cloud folder or Git).
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
