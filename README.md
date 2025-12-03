# File Metro

**File Metro** reimagines your file explorer as a high-speed transit network. Visualize your files as stations, connect them with lines, and manage your workspace with the efficiency of a modern metro system.

![File Metro Banner](images/banner.png)

## Features

### 🚇 Metro Map Interface
-   **Visual Workspace**: Files are represented as "stations" on an infinite canvas.
-   **Drag & Drop**: Simply drag files from the VS Code explorer onto the map to create new stations.
-   **Connections**: Draw lines between stations to visualize dependencies or related files (Hold `Alt` + Drag).

### ⚡ High-Speed Workflow
-   **Quick Open**: Double-click any station to instantly open the file.
-   **Smart Layout**: Stations snap to a grid for a clean, organized look.
-   **Mini Map**: Navigate large workspaces easily with the built-in mini map.

### 🏷️ Marking & Organization
-   **Status Marks**: Keep track of your progress.
    -   **Default Mark**: `Ctrl` + Click to toggle a simple dot.
    -   **Custom Marks**: Right-click to choose Check (✓), Star (★), and more.
-   **Color Coding**: Group related files by color for quick visual identification.

### 📦 Batch Actions
Manage multiple files at once:
1.  **Multi-Select**: Hold `Shift` and click multiple stations.
2.  **Right-Click**: Access batch actions to:
    -   **Color**: Change color for all selected files.
    -   **Mark**: Apply status marks to the entire selection.
    -   **Delete**: Remove multiple stations instantly.

## Usage

1.  Open the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2.  Run **"Metro: Open Metro View"**.
3.  Start building your metro network!

## Extension Settings

This extension contributes the following settings:

*   `metro.snapGrid`: Enable/disable grid snapping (default: `true`).
*   `metro.defaultColor`: Set the default color for new stations.

## Release Notes

### 0.0.1
-   Initial release of File Metro.
-   Added Marking, Multi-select, and Batch Actions.
-   Improved Context Menu stability.

---

**Enjoy your high-speed coding journey!** 🚅
