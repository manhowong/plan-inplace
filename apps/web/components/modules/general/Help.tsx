import {Info, ArrowUp} from 'lucide-react';

export function Help() {
  return (
    <div className="h-full overflow-y-auto bg-bg p-6 sm:p-10 text-text-primary text-base">
      <div id="top" className="max-w-3xl space-y-12">

        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold pb-6">Help & Documentation</h1>
          
          <p className="text-xl">
            <strong>Plan InPlace</strong> is a lightweight, open-source planner that keeps your plan and your project in one place, integrating project management into your agile workflow.
          </p>
          <p className="text-base leading-relaxed">
            <strong>No setup</strong>: Create a plan instantly in your current workspace or selected location.<br/>
            <strong>Full data control</strong>: Keep data offline, or sync it with Git and your cloud drive.<br/>
            <strong>Git-native</strong>: Track and sync tasks along with your Git workflow.<br/>
            <strong>Flexible</strong>: Manage tasks quickly with the VS Code sidebar, or use advanced planning features with Kanban and more.<br/>
            <strong>AI-ready</strong>: Data is stored in standard JSON for easy LLM integration.
          </p>

        </div>

        {/* Table of Contents Section */}
        <section className="w-fit space-y-4 border border-border rounded-md p-6">
          
          <h2 className="text-base font-bold uppercase text-text-primary">
            On this page
          </h2>
          <ul className="space-y-2 text-base">
            <li><a href="#installation" className="text-accent hover:underline">Installation</a></li>
            <li>
              <a href="#how-to-use" className="text-accent hover:underline">How to Use</a>
              <ul className="pl-4 space-y-1 mt-1">
                <li><a href="#create-or-open-a-plan" className="text-accent hover:underline">Create or open a plan</a></li>
                <li><a href="#add-a-task" className="text-accent hover:underline">Add a task</a></li>
                <li><a href="#customize-task-fields" className="text-accent hover:underline">Customize task fields</a></li>
                <li><a href="#view-modes" className="text-accent hover:underline">View modes</a></li>
              </ul>
            </li>
            <li><a href="#faqs" className="text-accent hover:underline">FAQs</a></li>
          </ul>
        </section>

        {/* Installation Section */}
        <section id="installation" className="space-y-12">
          <h2 className="text-2xl font-bold uppercase border-b-5 w-fit border-border">Installation</h2>

          <div className="space-y-2">
              <p><strong>VS Code</strong>: Install from the VS Code Marketplace.</p>
              <p><strong>Web App</strong>: Access at <a href="https://planinplace.netlify.app/" className="text-accent hover:underline">planinplace.netlify.app</a>.</p>
              <p>Both options allow for offline use.</p>
          </div>
        </section>

        {/* How to Use Section */}        
        <section id="how-to-use" className="space-y-12">
          <h2 className="text-2xl font-bold uppercase border-b-5 w-fit border-border">How to Use</h2>

          <div
            className="flex items-center gap-3 px-4 py-2 bg-priority-med/10 border border-priority-med rounded-md  "
          >
            <Info className="w-5 h-5 text-priority-med flex-shrink-0" />
            <p>
              <strong>VS Code users</strong>: 
              It may take a few seconds for the extension to activate upon VS Code startup. If the UI is unresponsive, please wait for activation to complete.
            </p>
          </div>


          <div className="space-y-12">

            <div id="create-or-open-a-plan" className="space-y-4">
              <h3 className="text-2xl font-bold">Create or open a plan</h3>
              <p>You can create or open a plan <strong>anywhere on your machine</strong>:</p>
              <ul className="list-disc pl-5   space-y-2">
                <li>Click <strong>Create a Plan</strong> &gt; select a location. This initializes a new plan and creates a <code>plan-inplace</code> folder in the selected location.</li>
                <li>Click <strong>Open a Plan</strong> &gt; select a <code>plan-inplace</code> folder (or a project folder containing a <code>plan-inplace</code> folder).</li>
              </ul>
              <p className=" ">Viewed plans are added to the <strong>Recent Plans</strong> list for easy access.</p>
            </div>

            <div id="add-a-task" className="space-y-4">
              <h3 className="text-2xl font-bold ">Add a task</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Go to <strong>Active Tasks</strong>.
                  <img src="https://raw.githubusercontent.com/manhowong/plan-inplace/refs/heads/main/assets/images/screenshots/active-tasks.png" alt="Active Tasks" className="border border-border shadow-md rounded-md mt-2 w-[30%]" />
                </li>
                <li>Add a task via 3 options:
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li><strong>Quick add</strong> input in the header.</li>
                    <li><strong>Details</strong> button in the header.</li>
                    <li><strong>Plus icon</strong> in Board view (Kanban).</li>
                  </ul>
                  <img src="https://raw.githubusercontent.com/manhowong/plan-inplace/refs/heads/main/assets/images/screenshots/add-task.png" alt="Add task options" className="border border-border shadow-md rounded-md mt-2 w-[70%]" />
                </li>
              </ol>
            </div>

            <div id="customize-task-fields" className="space-y-4">
              <h3 className="text-2xl font-bold ">Customize task fields</h3>
              <p>
                Each task has these default fields: <code>Title</code>, <code>Notes</code>, <code>Tags</code>, <code>Status</code>, <code>Priority</code>, <code>Due Date</code>.
              </p>
              <p>
                You can customize <code>Status</code> options or add more fields in <strong>Plan Settings</strong>.
              </p>
              <p>
                Customized task fields only apply to one plan. To use the same settings from another plan, click <strong>Import from Another Plan...</strong>
              </p>
            </div>

            <div id="view-modes" className="space-y-4">
              <h3 className="text-2xl font-bold ">View modes</h3>
              <p>
                Toggle between Board (Kanban) and Table views in the app sidebar.
              </p>
              <img src="https://raw.githubusercontent.com/manhowong/plan-inplace/refs/heads/main/assets/images/screenshots/toggle-view.png" alt="Toggle view" className="border border-border shadow-md rounded-md w-[25%]" />
              <p className=" ">Advanced settings:</p>
              <ul className="list-disc pl-5   space-y-2">
                <li><strong>Board Settings</strong>: Toggle between grouping by task status (Classical Kanban) or by task priority. (To customize status order and options, see Plan Settings.)</li>
                <li><strong>Table Settings</strong>: Customize column order and visibility.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section id="faqs" className="space-y-12">
          <h2 className="text-2xl font-bold border-b-5 w-fit border-border">FAQs</h2>
          
          <div className="space-y-10">
            <div className="space-y-2">
              <p className="font-bold">Where is my plan stored?</p>
              <p className="">
                It is stored in standard JSON in your current workspace or selected location:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><code>/plan-inplace/plan.json</code> (plan details, e.g. tasks)</li>
                <li><code>/plan-inplace/metadata.json</code> (configurations)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold">Can I move the <code>plan-inplace</code> folder?</p>
              <p className="">
                Yes. You can move it anywhere. If the app loses the link, just click <strong>Open a Plan</strong> and select the folder in its new location to restore it to the Recent Plans list.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold">Can I track my plan with Git or Cloud services?</p>
              <p className="">
                Yes. The data (JSON) structure is designed for easy versioning and conflict resolution. Commit the folder to Git for versioning, or store it in a synced folder (Dropbox, OneDrive, etc.) for cross-device access.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold">Can I collaborate with others?</p>
              <p className="">
                Yes. The app allows for concurrent file access. Simply store the plan folder in a shared cloud drive. For asynchronous collaboration, commit it to your Git repository. Team members can pull, edit, and push changes just like code.
              </p>
            </div>
          </div>
        </section>

      </div>
      
      <a 
        href="#top" 
        className="inline-flex items-center gap-1 uppercase text-accent hover:underline py-12">
        <ArrowUp className='w-4 h-4 flex-shrink-0' />
        Back to Top
      </a>

    </div>
  );
}