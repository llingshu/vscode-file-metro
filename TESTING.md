# Metro View Testing Guide

## Test Steps

### 1. Initial Setup
1.  Open the folder `todo_vscode` in VS Code.
2.  Run `npm install` and `npm run compile`.
3.  Press `F5` to launch the extension in a new window.

### 2. Opening Metro View
1.  In the new window, open the Command Palette (`Cmd+Shift+P`).
2.  Run command: `Open Metro View`.
3.  Verify that a "Metro View" panel opens.

### 3. Adding Files
1.  Open the Explorer sidebar.
2.  Drag a file (e.g., `package.json`) from the Explorer onto the Metro View canvas.
3.  **Verify**: A **Station Node** (small white circle, ~14px) appears.
4.  **Verify**: The filename appears below the station, not blocked by it.
5.  **Verify**: Clicking the station opens the file.

### 4. Connections (Metro Lines)
1.  Add another file to the canvas.
2.  Drag from one station's handle (top/bottom) to the other.
3.  **Verify**: A thick colored line connects them.
4.  **Verify**: The line color is randomly assigned from the Metro palette.

### 5. Grid System
1.  **Verify**: The background shows a dot matrix pattern (dots are visible, ~4px).
2.  Drag a station node.
3.  **Verify**: The node snaps to the grid dots (centered on them).
4.  **Verify**: The station node is slightly larger than the grid dot.
4.  Right-click to create a note.
5.  **Verify**: The new note station also snaps to the grid.

### 4. Persistence
1.  Close the Metro View panel.
2.  Re-open Metro View (`Open Metro View`).
3.  **Verify**: The dot is still there in the same position.
4.  Reload the window (`Cmd+R`).
5.  Re-open Metro View.
6.  **Verify**: The dot is still there.

### 5. File Tracking (Rename)
1.  Rename the file you added (e.g., `package.json` -> `pkg.json`) in the Explorer.
2.  **Verify**: The dot label updates to `pkg.json`.
3.  **Verify**: Clicking the dot still opens the renamed file.

### 6. File Tracking (Delete)
1.  Delete the file `pkg.json`.
2.  **Verify**: The dot turns Gray (or indicates missing status).

### 7. Note Creation
1.  Right-click anywhere on the empty canvas.
2.  Select "Create Note".
3.  **Verify**: A new dot appears with a name like `Note_2023...md`.
4.  **Verify**: A file is created in the `.Note` directory in your workspace.
5.  **Verify**: Clicking the dot opens the new note file.

## Data Schema
The extension uses a JSON file stored in `.vscode/metro-layout.json` to persist the layout.

### Fields
-   `nodes`: Array of node objects.
    -   `id`: Unique UUID.
    -   `type`: "file" or "note".
    -   `filePath`: Absolute path to the file.
    -   `position`: Object `{ x, y }` coordinates.
    -   `label`: Display name of the file.
    -   `status`: "active" or "missing".
-   `groups`: Array of group objects (Planned).
-   `edges`: Array of connections (Planned).
