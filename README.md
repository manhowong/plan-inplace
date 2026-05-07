# Plan InPlace

A task management tool where all data is stored in local JSON files on your machine. No records are sent to any server.

## About

- **Source**: [github.com/manhowong/plan-inplace](https://github.com/manhowong/plan-inplace)
- **Developer**: [Man-Ho Wong](https://github.com/manhowong)
- **Sponsor**: [GitHub Sponsors](https://github.com/sponsors/manhowong)
- **License**: Apache License 2.0

## Documentation

### Usage

#### Create a plan
1. Click **Create a Plan** in the sidebar.
2. Select a folder on your computer.
3. A directory named `/plan-inplace` will be created to store your data.

#### Add a task
1. Use the **Quick add** input in the header.
2. Click **Details** in the header or the **Plus** icon in Board columns to open the full task dialog.
3. Fill in the fields and click **Add Task**.

#### Board and Table views
Toggle between views in the sidebar. **Board** view is for visual tracking; **Table** view is for bulk data management and sorting.

#### Customize task fields
Go to **Settings** to define custom metadata (dropdowns, text, numbers). These are stored in `metadata.json`.

### FAQ

**Where is my plan stored?**  
In the folder you picked during setup. Files: `/plan-inplace/plan.json` (tasks) and `/plan-inplace/metadata.json` (configuration).

**Can I track my plan with Git or cloud services?**  
Yes. Since the data is in standard JSON format, you can initialize a Git repository in the plan folder or save it inside a syncing folder (Dropbox, iCloud, etc.).

**Can I share my plan and collaborate with others?**  
Yes. Multiple users can edit the same plan if they have shared access to the filesystem.
