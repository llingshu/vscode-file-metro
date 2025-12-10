# Metro Code Board
(Formerly File Metro)

![Metro Code Board Banner](images/banner.jpg)

**Metro Code Board** is an infinite canvas for your code. It visualizes your workspace as a metro map, allowing you to see connections, plan architecture, and think spatially.

## Vision: The Infinite Code Canvas

I built **Metro Code Board** based on a simple belief: **links should be intentional**.

But as I used it, I realized that a simple map isn't enough. We need a **spatial workspace**—an infinite canvas where code, thoughts, and diagrams live side-by-side.

My goal is to evolve this tool into a **Whiteboard for your Codebase**. It won't just be for navigating files; it will be for *thinking* about them.

## Roadmap

I am actively working on transforming this extension into a full-featured infinite canvas. Here is the plan:

*   [ ] **Whiteboard Tools**: Add text boxes, shapes (rectangles, circles), and sticky notes to the canvas.
*   [ ] **Groups**: Ability to group nodes together and navigate to them via a sidebar list.
*   [ ] **Rich Connections**: Add labels and direction arrows to connections to describe relationships (e.g., "imports", "depends on").
*   [ ] **Multimedia**: Support for images and markdown snippets directly on the canvas.
*   [ ] **Refactoring**: Rename the project to reflect this new direction (e.g., "Code Canvas" or "Metro Board").

## Features

*   **Local Metro View**: A dedicated sidebar view that syncs with your active file.
*   **Visual Map**: Drag & drop files to create stations.
*   **Connections**: Hold `Alt` + Drag between stations to link them.
*   **Organization**: Color code stations and add status marks (Check, Star).
*   **Batch Actions**: Multi-select (`Shift` + Click) to color, mark, or delete groups.
*   **Theme Aware**: Adapts to Light and Dark modes.

## Usage

1.  Open Command Palette (`Cmd+Shift+P`).
2.  Run **"Metro: Open Metro View"**.
3.  Drag files from Explorer to the map.

## Shortcuts

| Action | Shortcut |
| :--- | :--- |
| **Connect Stations** | Hold `Alt` + Drag |
| **Multi-Select** | Hold `Shift` + Click / Drag |
| **Toggle Default Mark** | `Ctrl` / `Cmd` + Click Station |
| **Open File** | Double Click Station |
| **Pan Canvas** | Drag Background (if unlocked) |
| **Zoom** | Scroll Wheel (if unlocked) |
| **Rename Station** | Middle Click Station |
| **Create Note** | Middle Click Background |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
