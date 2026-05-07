# Plan InPlace

> VS Code extension coming soon. Stay tuned :)

**Plan InPlace** is a project planner that allows you to create and manage *portable* plans: plans that live with individual projects or anywhere you like.

- **No setup**. Create a plan and add tasks quickly.
- Store data **locally** and **track** with Git, or sync with your cloud services.
- Manage tasks with **Kanban, table, and more**.
- **AI-friendly** JSON data and templates (to be provided in next release). Generate plans for your projects easily and manage them with Plan InPlace. 

## Quick Start

### Create a plan

1. Click **Create a Plan**.
2. Select a location on your computer (e.g., your project folder).
3. A folder named `/plan-inplace` will be created to store your data.

### Add a task

Go to **Active Tasks**, then:

- **(Option 1)** Use the **Quick add** input in the header for fast entry.
- **(Option 2)** Click **Details** in the header or the **Plus** icon in Board columns to open the full task dialog. Fill in the fields and click **Add Task**.

### Kanban Board and Table views

Toggle between views in the sidebar.

### Customize task fields

Go to **Plan Settings** to define task metadata (e.g., add new fields). These are stored in `metadata.json` and apply to all tasks in the plan.

To customize the order or visibility of table columns, or how tasks are grouped on Kanban, go to **Active Tasks** and press **Table Settings** or **Board Settings**.

## FAQ

**Where is my plan stored?**

In the folder you picked during plan creation. It is located at `/plan-inplace/plan.json` (tasks) and `/plan-inplace/metadata.json` (configuration).

---

**Can I move the `/plan-inplace` folder?**

Yes. You can move the folder to any location, but the app won't know the folder's new location and you won't be able to open it from the Recent Plans list. Simply press **Open a Plan** to open it and add it back to the Recent Plans list.

---

**Can I track my plan with Git or cloud services?**

Yes. Since the data is stored in standard JSON format, you can initialize a Git repository in the plan folder or save the plan inside a cloud folder (e.g., Google Drive) for syncing.

---

**Can I share my plan and collaborate with others?**

Yes. Multiple users can edit the same plan if they have shared access to the filesystem (e.g., via a shared cloud folder or Git).

## About

| | |
|---|---|
| **Source** | [github.com/manhowong/plan-inplace](https://github.com/manhowong/plan-inplace) |
| **Developer** | [@manhowong](https://github.com/manhowong) |
| **License** | [Apache License 2.0](https://github.com/manhowong/plan-inplace/blob/main/LICENSE) |

### Support

- [Suggest or report an issue](https://github.com/manhowong/plan-inplace/issues/new)
- [Sponsor me on GitHub ♥](https://github.com/sponsors/manhowong)

### Versions

| Version | Status |
|---|---|
| Web App | Beta |
| VS Code Extension | Coming Soon |