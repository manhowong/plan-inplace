**Plan InPlace**

- [Introduction](#introduction)
  - [Installation](#installation)
- [How to Use](#how-to-use)
  - [Sidebar (VS Code)](#sidebar-vs-code)
  - [Main Interface](#main-interface)
    - [Launch the interface in VS Code](#launch-the-interface-in-vs-code)
    - [Create or open a plan](#create-or-open-a-plan)
    - [Add a task](#add-a-task)
    - [Customize task fields](#customize-task-fields)
    - [View modes](#view-modes)
- [FAQs](#faqs)
- [About](#about)


## Introduction

**Plan InPlace** is a lightweight, open-source planner that keeps your plan and your project in one place, integrating project management into your agile workflow.

- **No setup**: Create a plan instantly in your current workspace or selected location.
- **Full data control**: Keep data offline, or sync it with Git and your cloud drive. 
- **Git-native**: Track and sync tasks along with your Git workflow.
- **Flexible**: Manage tasks quickly with the VS Code sidebar, or use advanced planning features with Kanban and more.
- **AI-ready**: Data is stored in standard JSON for easy LLM integration.

**Kanban view (grouped by task status):**

<img src="https://raw.githubusercontent.com/manhowong/plan-inplace/refs/heads/main/assets/images/screenshots/kanban-view.png">

**Table view:**

<img src="https://raw.githubusercontent.com/manhowong/plan-inplace/refs/heads/main/assets/images/screenshots/table-view.png">

### Installation

- **VS Code**: Install from the VS Code Marketplace.
- **Web App**: Access at [planinplace.netlify.app](https://planinplace.netlify.app/).
- Both options allow for offline use.

---

## How to Use

> **Note (VS Code users)**: It may take a few seconds for the extension to activate upon VS Code startup. If the UI is unresponsive, please wait for activation to complete.

### Sidebar (VS Code)

Use the sidebar in VS Code for quick plan management.

- Click the **Plan InPlace icon** <img src="https://raw.githubusercontent.com/manhowong/plan-inplace/refs/heads/main/assets/images/icon-192.png" height="25"> in the "Activity Bar" (left of window):
    
    <img src="https://raw.githubusercontent.com/manhowong/plan-inplace/refs/heads/main/assets/images/screenshots/sidebar-icon.png" width="150">


- Click **Create a Plan**. This initializes a new plan and creates a **`plan-inplace`** folder in the current workspace to store the plan.
- **Add, archive, or delete tasks** directly from the sidebar.
- **Auto-load**: Loads your plan automatically when you open the workspace.

### Main Interface

Use the main interface for advanced features. Identical in both VS Code and the web app.

#### Launch the interface in VS Code

3 ways to launch the full interface:

- **Keyboard Shortcut**: `Shift+Alt+P`
- **Command Palette**: `>Plan InPlace: Open Plan InPlace App`
- **VS Code Sidebar**: Open Plan InPlace Sidebar > Click **Open Full App**.

#### Create or open a plan

You can create or open a plan **anywhere on your machine**:
- Click **Create a Plan** > select a location. This initializes a new plan and creates a **`plan-inplace`** folder in the selected location.
- Click **Open a Plan** > select a **`plan-inplace`** folder (or a project folder containing a **`plan-inplace`** folder)

Viewed plans are added to the **Recent Plans** list for easy access.

#### Add a task

1. Go to **Active Tasks**

    <img src="https://raw.githubusercontent.com/manhowong/plan-inplace/refs/heads/main/assets/images/screenshots/active-tasks.png" width="30%">

2. Add a task via 3 options:
- **Quick add** input in the header.
- **Details** button in the header.
- **Plus icon** in Board view (Kanban).

    <img src="https://raw.githubusercontent.com/manhowong/plan-inplace/refs/heads/main/assets/images/screenshots/add-task.png" width="70%">

#### Customize task fields

Each task has these default fields: **`Title`, `Notes`, `Tags`, `Status`, `Priority`, `Due Date`**.

You can customize **`Status`** options or add more fields in **Plan Settings**.

Customized task fields only apply to one plan. To use the same settings from another plan, click **Import from Another Plan...** .

#### View modes

Toggle between Board (Kanban) and Table views in the app sidebar:

<img src="https://raw.githubusercontent.com/manhowong/plan-inplace/refs/heads/main/assets/images/screenshots/view-toggle.jpeg" width="25%">

Advanced settings:
- **Board Settings**: Toggle between grouping by task status (Classical Kanban) or by task priority. To customize status order and options, see [Customize task fields](#customize-task-fields).
- **Table Settings**: Customize column order and visibility.

---

## FAQs

**Where is my plan stored?**

It is stored in standard JSON in your current workspace or selected location:
- **`/plan-inplace/plan.json`** (plan details, e.g. tasks)
- **`/plan-inplace/metadata.json`** (configurations)

**Can I move the `plan-inplace` folder?**

Yes. You can move it anywhere. If the app loses the link, just click **Open a Plan** and select the folder in its new location to restore it to the Recent Plans list.

**Can I track my plan with Git or Cloud services?**

Yes. The data (JSON) structure is designed for easy versioning and conflict resolution. Commit the folder to Git for versioning, or store it in a synced folder (Dropbox, OneDrive, etc.) for cross-device access.

**Can I collaborate with others?**
  
Yes. The app allows for concurrent file access. Simply store the plan folder in a shared cloud drive. For asynchronous collaboration, commit it to your Git repository. Team members can pull, edit, and push changes just like code.

---

## About

- **Source**: [GitHub](https://github.com/manhowong/plan-inplace)
- **License**: [Apache License 2.0](https://github.com/manhowong/plan-inplace/blob/main/LICENSE)
- **Developer**: [@manhowong](https://github.com/manhowong)
- **Support**:
  - [Pull request](https://github.com/manhowong/plan-inplace/issues/new?template=become-a-contributor.md)
  - [Report an Issue](https://github.com/manhowong/plan-inplace/issues/new)
  - [Sponsor on GitHub ♥](https://github.com/sponsors/manhowong)