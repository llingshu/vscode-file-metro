# Changelog

All notable changes to this project will be documented in this file.

## [0.2.5]
### Added
- **Plan Mark**: Added a new "Plan" mark (Square) which features a checkbox to toggle completion directly on the node.
- **Sidebar Support**:
    - **Sidebar Icons**: Plan items in the sidebar now display as square icons (outlined or filled) to match the map.
    - **Toggle Completion**: Added "Toggle Done" context menu item for Plan tasks in the sidebar.

### Changed
- **Interactions**:
    - **Unified Click Behavior**: Single-clicking any item in the Sidebar now **only focuses** the node (in both Main Map and Local View) without opening the file.
    - **Double Click**: Double-clicking a Sidebar item is now required to open the file.
    - **Local View Focus**: Clicking a Sidebar item now actively updates the Local Metro View to center on that node.

### Fixed
- **Commands**: Fixed "command 'metro.focusNode' not found" error when clicking items in the sidebar.

## [0.2.4]
### Added
- **Visuals**:
    - **Mark Styles**: 
        - **Solid (Default)**: Default mark is now a Solid Circle.
        - **Blank**: Added "Blank" (Hollow Ring) style.
        - **Hollow**: Preserved "Hollow" option for compatibility.

### Changed
- **Visuals**:
    - **Icon**: Updated extension icon to a more representative metro map style with a prominent station.

## [0.2.3]
### Added
- **Sidebar**: Restructured into 4 stacked panels (Plan, Tasks, Coordinates, History) for better organization.
- **Interactions**:
    - **Single Click Focus**: Clicking a sidebar item now immediately focuses the node on the map.
    - **Open File**: Added dedicated "Open File" context menu and button.

### Changed
- **Visuals**:
    - **Coordinate Icons**: Updated to "Concentric Circles" design.
    - **Sharpening**: Icons are now pixel-perfect with sharper strokes and alignment.
    - **Icon Sizing**: Map icons have a smaller inner circle (`r=4`) while Sidebar icons remain larger (`r=3.5`) for optimal visibility in each context.

## [0.2.2]
### Changed
- **Context Menu**: Improved stability with a 0.5s closing delay and smart gap detection to prevent accidental closing.
- **Visuals**:
    - **Coordinate Marker**: New SVG design with thicker lines that match the node's color.
    - **Tasks**: Completed tasks now display as a solid filled square (matching node color) instead of green.
- **New Notes**: Newly created notes are now automatically assigned a random color.

## [0.2.1]
### Changed
- **Interactions**: Reverted panning to default `Left Drag`, Box Selection is `Shift + Left Drag`.

## [0.2.0]
### Added
- **Advanced Markers**: Added 'Coordinate' (+) and 'Task' (■) markers.
- **Task Management**: Tasks can be completed (Green status) via `Ctrl+Click` or from the side panel.
- **Navigation Panels**: Quick navigation panels for Coordinates and Tasks with interactive checkboxes.
- **Connection Annotations**: Double-click connections to add text labels.

### Changed
- **Rebranding**: Renamed extension to **Metro Code Board: Architecture & Whiteboard**.
- **Interactions**: Panning was temporarily `Space + Drag` (Reverted in 0.2.1).
- **UI Polish**: Fixed Context Menu auto-closing and default cursor styles.

## [0.1.3]
### Fixed
- **Context Menu**: Fixed issue where context menu would close immediately upon releasing the right mouse button.
- **Persistence**: Fixed issue where station markers (Check, Star, etc.) were not saving correctly and disappeared on reload.

## [0.1.2]
### Added
- **Middle-Click Rename**: Middle-click on a station node to rename it.
- **Middle-Click Create**: Middle-click on the background to create a new note at that position.

### Fixed
- **MiniMap Visibility**: Fixed issue where off-screen nodes were hidden in the MiniMap.
- **MiniMap Viewport**: Added a clear border to the MiniMap viewport indicator.

## [0.1.1]
### Fixed
- **Local View Update**: Fixed issue where Local Metro View would not update automatically when creating new notes or routes.

## [0.1.0]
### Added
- **Local Metro View**: New sidebar view that automatically centers on the active file.
- **Local Interactions**: Enabled dragging and context menus in Local View.
- **Config**: Added `metro.showInactiveStations` setting.

### Changed
- **UI**: Removed React Flow attribution for a cleaner look.
- **Visuals**: Increased size of inactive stations in Local View for better visibility.

## [0.0.4]
### Fixed
- **TypeScript Version**: Updated to compatible version.

## [0.0.3]
### Added
- **Theme Support**: Full support for VS Code Light and Dark themes.
- **Persistence**: Station marks and layout now persist correctly.
- **Rename**: Rename files directly from the station context menu.
- **Context Menu**: Improved UX with delayed closing.
- **Assets**: Added project icon and banner.

### Fixed
- **Default Mark**: Refined style for better visibility.
- **Lock Behavior**: Simplified lock controls (Zoom Lock only).

## [0.0.2]
- Added MIT License.
- Added Repository URL.

## [0.0.1]
- Initial release with Drag & Drop, Metro Map visualization, and Batch Actions.
