# Plan InPlace

**Plan InPlace** is a lightweight, open-source planner for agile projects.
- **No setup**. Your plan lives inside your project, or anywhere you choose.
- Keep data **local** or track with **Git** and sync with your **cloud** services.
- Manage tasks with **Kanban, table, and more**.
- **AI-ready** JSON data and templates (to be provided in next release). Generate plans for your projects easily and manage them with Plan InPlace. 

---

## Installation

**VS Code**: Install via the VS Code Marketplace.

**Web app**: Launch the app at [planinplace.netlify.app](https://planinplace.netlify.app/).

---

## Quick Start (VS Code)

The extension provides two interfaces:
- Sidebar
- Main UI 

> **ATTENTION**:
> It takes a few seconds for VS Code to activate the extension during startup. The extension may not be responsive until it is fully activated.

### Sidebar

- To open it, press the Plan InPlace icon on the sidebar.

    ![sidebar-icon](https://raw.githubusercontent.com/manhowong/plan-inplace/refs/heads/main/assets/images/sidebar-icon.png)

- To create a plan in the current workspace, press **Create a Plan**.
    - A folder (`plan-inplace`) will be created in the current workspace. Your plan data will be stored there.
- You can then **add tasks** to the plan, **archive tasks**, or **delete archived tasks** quickly using the sidebar.
- Next time when you open the same workspace, the existing plan will be loaded automatically into the sidebar.
- For advanced features, use the main UI (see next section).

## Main UI

Launch it using one of the following approaches:
- Press **`Shift+Alt+P`**
- Enter in the **command palette**:
    
    ```
    > Plan InPlace:Open Plan InPlace App
    ```
- Press the button **Open Full App** in the extension's sidebar.

### Create a plan

1. Click **Create a Plan** in the main UI.
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


**Source**: [github.com/manhowong/plan-inplace](https://github.com/manhowong/plan-inplace)

**Developer**: [@manhowong](https://github.com/manhowong)

**License**: [Apache License 2.0](https://github.com/manhowong/plan-inplace/blob/main/LICENSE)

### Support

- [Suggest or report an issue](https://github.com/manhowong/plan-inplace/issues/new)
- [Sponsor me on GitHub ♥](https://github.com/sponsors/manhowong)
