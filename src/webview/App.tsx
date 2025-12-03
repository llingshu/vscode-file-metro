import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    ControlButton,
    Background,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    Connection,
    ReactFlowProvider,
    Panel,
    NodeTypes,
    EdgeChange,
    NodeChange,
    applyNodeChanges,
    applyEdgeChanges,
    useReactFlow,
    BackgroundVariant,
    ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MetroNode, MetroLayout } from '../types';
import { v4 as uuidv4 } from 'uuid';

// VS Code API
declare const acquireVsCodeApi: () => {
    postMessage: (message: any) => void;
    getState: () => any;
    setState: (state: any) => void;
};

const vscode = acquireVsCodeApi();

import StationNode from './StationNode';
import ContextMenu, { MenuItem } from './ContextMenu';
import ColorPickerModal from './ColorPickerModal';

// ... existing code ...

const nodeTypes: NodeTypes = {
    station: StationNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const METRO_COLORS = [
    '#e3002c', // Red
    '#007fd4', // Blue
    '#008000', // Green
    '#f3a900', // Yellow
    '#800080', // Purple
    '#ff7f00', // Orange
    '#a0a0a0', // Grey
];

const App = () => {
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [connectionMode, setConnectionMode] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [menu, setMenu] = useState<{ x: number; y: number, flowPosition: { x: number, y: number }, nodeId?: string } | null>(null);
    const [zoomLocked, setZoomLocked] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const { project, fitView, setViewport, getViewport, getNodes, getEdges, setCenter, screenToFlowPosition } = useReactFlow();
    const [shadowNodes, setShadowNodes] = useState<Node[]>([]);
    const [showInactiveStations, setShowInactiveStations] = useState((window as any).initialConfig?.showInactiveStations ?? true);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Alt') setConnectionMode(true);
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Alt') setConnectionMode(false);
        };
        const handleBlur = () => setConnectionMode(false);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    // Save Layout Function
    const saveLayout = useCallback(() => {
        if (!isLoaded || isRestoring.current) return;

        const currentViewport = getViewport();
        const currentNodes = getNodes();
        const currentEdges = getEdges();

        // Ensure we NEVER save ghost nodes
        const cleanNodes = currentNodes.filter(n => !n.id.startsWith('ghost-'));

        const layout: MetroLayout = {
            nodes: cleanNodes.map(n => ({
                id: n.id,
                type: 'file',
                filePath: n.data.filePath,
                position: n.position,
                label: n.data.label,
                status: n.data.status,
                color: n.data.color, // Save color
                mark: n.data.mark // Save mark
            })),
            groups: [],
            edges: currentEdges.map(e => ({
                id: e.id,
                source: e.source,
                target: e.target
            })),
            viewport: currentViewport,
            zoomLocked: zoomLocked
        };
        vscode.postMessage({ command: 'saveLayout', layout });
    }, [isLoaded, zoomLocked, getViewport, getNodes, getEdges]);

    useEffect(() => {
        vscode.postMessage({ command: 'webviewReady' });
    }, []);

    const onContextMenu = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            const pane = reactFlowWrapper.current?.getBoundingClientRect();
            if (pane) {
                const flowPosition = project({
                    x: event.clientX - pane.left,
                    y: event.clientY - pane.top,
                });
                // Snap to grid
                flowPosition.x = Math.round(flowPosition.x / 40) * 40;
                flowPosition.y = Math.round(flowPosition.y / 40) * 40;

                setMenu({
                    x: event.clientX,
                    y: event.clientY,
                    flowPosition
                });
            }
        },
        [project]
    );

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            event.preventDefault();
            event.stopPropagation(); // Prevent pane context menu

            setMenu({
                x: event.clientX,
                y: event.clientY,
                flowPosition: node.position, // Not used for node menu but keeps type happy
                nodeId: node.id
            });
        },
        []
    );

    const onPaneClick = useCallback(() => setMenu(null), []);

    const createNote = useCallback(() => {
        if (menu && !menu.nodeId) {
            vscode.postMessage({ command: 'createNote', position: menu.flowPosition });
            setMenu(null);
        }
    }, [menu]);

    const changeNodeColor = useCallback((color: string) => {
        if (menu && menu.nodeId) {
            setNodes((nds) => nds.map(n => {
                if (n.id === menu.nodeId) {
                    return { ...n, data: { ...n.data, color } };
                }
                return n;
            }));

            // Update outgoing edges to match new color
            setEdges((eds) => eds.map(e => {
                if (e.source === menu.nodeId) {
                    return { ...e, style: { ...e.style, stroke: color } };
                }
                return e;
            }));

            setMenu(null);
            setTimeout(() => saveLayout(), 0);
        }
    }, [menu, setNodes, setEdges, saveLayout]);

    const renameNode = useCallback(() => {
        if (menu && menu.nodeId) {
            const node = nodes.find(n => n.id === menu.nodeId);
            if (node && node.data.filePath) {
                vscode.postMessage({
                    command: 'renameNode',
                    id: node.id,
                    oldPath: node.data.filePath
                });
                setMenu(null);
            }
        }
    }, [menu, nodes]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            // Intercept position changes to enforce snapping on Real Nodes
            const snappedChanges = changes.map(change => {
                if (change.type === 'position' && change.position) {
                    return {
                        ...change,
                        position: {
                            x: Math.round(change.position.x / 40) * 40,
                            y: Math.round(change.position.y / 40) * 40,
                        }
                    };
                }
                return change;
            });
            setNodes((nds) => applyNodeChanges(snappedChanges, nds));
        },
        [setNodes]
    );

    const onConnect = useCallback(
        (params: Connection) => {
            // Check if edge already exists
            const existingEdge = edges.find(e =>
                (e.source === params.source && e.target === params.target) ||
                (e.source === params.target && e.target === params.source)
            );

            if (existingEdge) {
                // Remove existing edge (toggle off)
                setEdges((eds) => {
                    const newEdges = eds.filter(e => e.id !== existingEdge.id);
                    setTimeout(() => saveLayout(), 0);
                    return newEdges;
                });
            } else {
                // Add new edge (toggle on)
                const sourceNode = nodes.find(n => n.id === params.source);
                const color = sourceNode?.data?.color || METRO_COLORS[Math.floor(Math.random() * METRO_COLORS.length)];

                const newEdge = {
                    ...params,
                    style: { stroke: color, strokeWidth: 4 },
                    type: 'straight',
                };
                setEdges((eds) => {
                    const newEdges = addEdge(newEdge, eds);
                    setTimeout(() => saveLayout(), 0);
                    return newEdges;
                });
            }
        },
        [setEdges, nodes, edges, saveLayout]
    );


    const isRestoring = useRef(false);

    // Handle Messages from Extension
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message.command === 'updateLayout') {

                isRestoring.current = true;
                const layout: MetroLayout = message.layout;
                // Convert MetroLayout to ReactFlow nodes/edges
                const newNodes: Node[] = layout.nodes.map(n => ({
                    id: n.id,
                    type: 'station', // Custom type
                    position: n.position,
                    data: {
                        label: n.label,
                        filePath: n.filePath,
                        status: n.status,
                        color: n.color, // Restore color
                        mark: n.mark, // Restore mark
                        isConnectionMode: false
                    },
                }));
                setNodes(newNodes);

                // Restore edges
                if (layout.edges) {
                    const newEdges: Edge[] = layout.edges.map(e => {
                        // Find source node to get color
                        const sourceNode = newNodes.find(n => n.id === e.source);
                        const color = sourceNode?.data?.color || '#007fd4';
                        return {
                            id: e.id,
                            source: e.source,
                            target: e.target,
                            type: 'straight',
                            style: { stroke: color, strokeWidth: 4 }
                        };
                    });
                    setEdges(newEdges);
                }

                // Restore viewport if it exists
                if (layout.viewport) {
                    setViewport(layout.viewport);
                }
                if (layout.zoomLocked !== undefined) {
                    setZoomLocked(layout.zoomLocked);
                }

                setIsLoaded(true);

                // Allow saving after a short delay to let viewport settle
                setTimeout(() => {
                    isRestoring.current = false;
                }, 500);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [setNodes, setEdges, setViewport]);

    // Update nodes when connection mode changes
    useEffect(() => {
        setNodes((nds) => nds.map(n => ({
            ...n,
            data: { ...n.data, isConnectionMode: connectionMode },
            draggable: !connectionMode // Disable dragging in connection mode
        })));
    }, [connectionMode, setNodes]);



    // Purge "ghost" nodes that might have been saved erroneously
    useEffect(() => {
        setNodes((nds) => {
            const cleanNodes = nds.filter(n => !n.id.startsWith('ghost-'));
            if (cleanNodes.length !== nds.length) {

                return cleanNodes;
            }
            return nds;
        });
    }, [setNodes]);

    const onMoveEnd = useCallback((event: any, viewport: any) => {
        if (event) {
            saveLayout();
        }
    }, [saveLayout]);

    const [dragGhost, setDragGhost] = useState<Node | null>(null);

    const onMiniMapClick = useCallback((event: React.MouseEvent, position: { x: number; y: number }) => {
        const { x, y } = position;
        setCenter(x, y, { zoom: 1, duration: 800 });
    }, [setCenter]);

    // Throttled Drag Handlers
    const lastDragUpdate = useRef(0);

    const onDragEnter = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.shiftKey) {
            event.dataTransfer.dropEffect = 'copy';
        } else {
            event.dataTransfer.dropEffect = 'none';
        }
    }, []);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        // VS Code requires Shift to drop into webview.
        // If Shift is not held, we hide the ghost to indicate drop is not available (or will open file).
        if (!event.shiftKey) {
            event.dataTransfer.dropEffect = 'none';
            setDragGhost(null);
            return;
        }

        event.dataTransfer.dropEffect = 'copy';

        const now = Date.now();
        if (now - lastDragUpdate.current < 50) return; // Throttle to 20fps
        lastDragUpdate.current = now;

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY
        });

        // Snap to grid
        position.x = Math.round(position.x / 40) * 40;
        position.y = Math.round(position.y / 40) * 40;

        setDragGhost(prev => {
            if (prev && prev.position.x === position.x && prev.position.y === position.y) {
                return prev;
            }
            return {
                id: 'drag-ghost',
                type: 'station',
                position,
                data: {
                    label: 'New Station',
                    status: 'active',
                    color: '#ffffff',
                    isGhost: true
                },
                style: { pointerEvents: 'none' },
                draggable: false,
                zIndex: 1000
            };
        });
    }, [screenToFlowPosition]);

    const onDragLeave = useCallback((event: React.DragEvent) => {
        // Only clear ghost if we actually leave the wrapper
        const wrapper = reactFlowWrapper.current;
        if (wrapper && wrapper.contains(event.relatedTarget as any)) {
            return;
        }
        setDragGhost(null);
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            setDragGhost(null); // Clear ghost

            // Check for VS Code D&D data
            // VS Code sends a list of files in 'text/uri-list'
            const data = event.dataTransfer.getData('text/uri-list');
            if (data) {
                const uris = data.split('\r\n').filter(u => u);

                const position = screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY
                });

                // Snap to grid
                position.x = Math.round(position.x / 40) * 40;
                position.y = Math.round(position.y / 40) * 40;

                const newNodes = uris.map(uri => {
                    let filePath = uri;
                    if (filePath.startsWith('file://')) {
                        filePath = decodeURIComponent(filePath.replace('file://', ''));
                    }

                    return {
                        id: uuidv4(),
                        type: 'station',
                        position,
                        data: {
                            label: filePath.split('/').pop(),
                            filePath,
                            status: 'active',
                            color: METRO_COLORS[Math.floor(Math.random() * METRO_COLORS.length)]
                        },
                    };
                });

                setNodes((nds) => {
                    const updatedNodes = nds.concat(newNodes);
                    // Save after drop
                    setTimeout(() => saveLayout(), 0);
                    return updatedNodes;
                });
            }
        },
        [setNodes, saveLayout, screenToFlowPosition]
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        // Handle Ctrl/Cmd + Click for Default Mark
        if (event.ctrlKey || event.metaKey) {
            setNodes((nds) => nds.map(n => {
                if (n.id === node.id) {
                    const currentMark = n.data.mark;
                    const newMark = currentMark === 'default' ? 'none' : 'default';
                    return { ...n, data: { ...n.data, mark: newMark } };
                }
                return n;
            }));
            setTimeout(() => saveLayout(), 0);
        }
    }, [setNodes, saveLayout]);

    const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {

        if (node.data.filePath) {

            vscode.postMessage({ command: 'openFile', filePath: node.data.filePath });
        } else {
            console.warn('Node has no filePath:', node);
        }
    }, []);

    const onNodeDragStart = useCallback((event: React.MouseEvent, node: Node) => {
        // Do nothing on start to allow clicks to pass through
        // Ghost creation is deferred to first drag move
    }, []);

    const onNodeDrag = useCallback((event: React.MouseEvent, node: Node) => {
        const pane = reactFlowWrapper.current?.getBoundingClientRect();
        if (pane) {
            const flowPos = project({
                x: event.clientX - pane.left,
                y: event.clientY - pane.top
            });

            // Initialize ghost if not already dragging
            if (shadowNodes.length === 0) {
                // 1. Make the Real Node (snapped) look like a ghost
                setNodes((nds) => nds.map(n => {
                    if (n.id === node.id) {
                        return { ...n, data: { ...n.data, isGhost: true } };
                    }
                    return n;
                }));

                // 2. Create a Solid Ghost Node that follows the mouse
                setShadowNodes([{
                    ...node,
                    id: `ghost-${node.id}`,
                    data: { ...node.data, label: '', isGhost: false }, // Solid
                    zIndex: 100, // On top
                    selected: true, // Look selected
                    draggable: false,
                    selectable: false,
                    type: 'station',
                    position: flowPos // Set initial position
                }]);
            } else {
                // Update existing ghost position
                setShadowNodes(prev => prev.map(g => ({
                    ...g,
                    position: flowPos
                })));
            }
        }
    }, [project, shadowNodes, setNodes]);

    const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
        // Only save if we actually dragged (shadow nodes exist)
        if (shadowNodes.length > 0) {
            setShadowNodes([]);

            // Restore Real Node opacity
            setNodes((nds) => nds.map(n => {
                if (n.id === node.id) {
                    return { ...n, data: { ...n.data, isGhost: false } };
                }
                return n;
            }));

            // Save layout after drag is complete
            setTimeout(() => saveLayout(), 0);
        }
    }, [setNodes, saveLayout, shadowNodes]);

    // Merge nodes with shadow nodes for rendering
    // Shadows should be behind
    const displayNodes = [...shadowNodes, ...(dragGhost ? [dragGhost] : []), ...nodes];

    const deleteNode = useCallback(() => {
        // Check if we are deleting a selection
        const selectedNodes = nodes.filter(n => n.selected);

        // If menu.nodeId is present, we might be deleting a specific node OR the selection containing it
        // If menu.nodeId is NOT present (pane click), we only delete if there is a selection

        let nodesToDelete: Node[] = [];

        if (menu?.nodeId) {
            nodesToDelete = selectedNodes.length > 1 && selectedNodes.find(n => n.id === menu.nodeId)
                ? selectedNodes
                : nodes.filter(n => n.id === menu.nodeId);
        } else if (selectedNodes.length > 0) {
            nodesToDelete = selectedNodes;
        }

        if (nodesToDelete.length > 0) {
            const idsToDelete = new Set(nodesToDelete.map(n => n.id));

            setNodes((nds) => {
                const updated = nds.filter(n => !idsToDelete.has(n.id));
                setTimeout(() => saveLayout(), 0);
                return updated;
            });
            // Also remove connected edges
            setEdges((eds) => eds.filter(e => !idsToDelete.has(e.source) && !idsToDelete.has(e.target)));
            setMenu(null);
        }
    }, [menu, nodes, setNodes, setEdges, saveLayout]);

    const batchColor = useCallback((color: string) => {
        const selectedNodes = nodes.filter(n => n.selected);
        if (selectedNodes.length > 0) {
            setNodes((nds) => nds.map(n => {
                if (n.selected) {
                    return { ...n, data: { ...n.data, color } };
                }
                return n;
            }));
            // Update outgoing edges for all selected nodes
            const selectedIds = new Set(selectedNodes.map(n => n.id));
            setEdges((eds) => eds.map(e => {
                if (selectedIds.has(e.source)) {
                    return { ...e, style: { ...e.style, stroke: color } };
                }
                return e;
            }));
            setTimeout(() => saveLayout(), 0);
        }
        setMenu(null);
    }, [nodes, setNodes, setEdges, saveLayout]);

    const batchMark = useCallback((mark: 'none' | 'default' | 'check' | 'star') => {
        const selectedNodes = nodes.filter(n => n.selected);
        if (selectedNodes.length > 0) {
            setNodes((nds) => nds.map(n => {
                if (n.selected) {
                    return { ...n, data: { ...n.data, mark } };
                }
                return n;
            }));
            setTimeout(() => saveLayout(), 0);
        }
        setMenu(null);
    }, [nodes, setNodes, saveLayout]);

    // Menu Items Configuration
    const getMenuItems = (): MenuItem[] => {
        if (!menu) return [];

        if (menu.nodeId) {
            const selectedNodes = nodes.filter(n => n.selected);
            const isBatch = selectedNodes.length > 1 && selectedNodes.some(n => n.id === menu.nodeId);

            if (isBatch) {
                return [
                    {
                        label: `Batch Color (${selectedNodes.length})`,
                        submenu: [
                            ...METRO_COLORS.map(color => ({
                                label: color,
                                color: color,
                                onClick: () => batchColor(color)
                            })),
                            {
                                label: 'Custom Color...',
                                onClick: () => setShowColorPicker(true) // Note: This will only apply to single node currently unless updated
                            }
                        ]
                    },
                    {
                        label: `Batch Mark (${selectedNodes.length})`,
                        submenu: [
                            { label: 'None', onClick: () => batchMark('none') },
                            { label: 'Default (Circle)', onClick: () => batchMark('default') },
                            { label: 'Check (✓)', onClick: () => batchMark('check') },
                            { label: 'Star (★)', onClick: () => batchMark('star') }
                        ]
                    },
                    {
                        label: `Delete ${selectedNodes.length} Stations`,
                        danger: true,
                        onClick: deleteNode
                    }
                ];
            }

            return [
                {
                    label: 'Rename',
                    onClick: renameNode
                },
                {
                    label: 'Mark',
                    submenu: [
                        {
                            label: 'None', onClick: () => {
                                setNodes(nds => nds.map(n => n.id === menu.nodeId ? { ...n, data: { ...n.data, mark: 'none' } } : n));
                                setMenu(null); saveLayout();
                            }
                        },
                        {
                            label: 'Default (Circle)', onClick: () => {
                                setNodes(nds => nds.map(n => n.id === menu.nodeId ? { ...n, data: { ...n.data, mark: 'default' } } : n));
                                setMenu(null); saveLayout();
                            }
                        },
                        {
                            label: 'Check (✓)', onClick: () => {
                                setNodes(nds => nds.map(n => n.id === menu.nodeId ? { ...n, data: { ...n.data, mark: 'check' } } : n));
                                setMenu(null); saveLayout();
                            }
                        },
                        {
                            label: 'Star (★)', onClick: () => {
                                setNodes(nds => nds.map(n => n.id === menu.nodeId ? { ...n, data: { ...n.data, mark: 'star' } } : n));
                                setMenu(null); saveLayout();
                            }
                        }
                    ]
                },
                {
                    label: 'Change Color',
                    submenu: [
                        ...METRO_COLORS.map(color => ({
                            label: color, // Could map hex to name if needed
                            color: color,
                            onClick: () => changeNodeColor(color)
                        })),
                        {
                            label: 'Custom Color...',
                            onClick: () => setShowColorPicker(true)
                        }
                    ]
                },
                {
                    label: 'Delete Station',
                    danger: true,
                    onClick: deleteNode
                }
            ];
        } else {
            const selectedNodes = nodes.filter(n => n.selected);
            if (selectedNodes.length > 0) {
                return [
                    {
                        label: `Batch Color (${selectedNodes.length})`,
                        submenu: [
                            ...METRO_COLORS.map(color => ({
                                label: color,
                                color: color,
                                onClick: () => batchColor(color)
                            })),
                            {
                                label: 'Custom Color...',
                                onClick: () => setShowColorPicker(true)
                            }
                        ]
                    },
                    {
                        label: `Batch Mark (${selectedNodes.length})`,
                        submenu: [
                            { label: 'None', onClick: () => batchMark('none') },
                            { label: 'Default (Circle)', onClick: () => batchMark('default') },
                            { label: 'Check (✓)', onClick: () => batchMark('check') },
                            { label: 'Star (★)', onClick: () => batchMark('star') }
                        ]
                    },
                    {
                        label: `Delete ${selectedNodes.length} Stations`,
                        danger: true,
                        onClick: deleteNode
                    },
                    {
                        label: 'Create Note',
                        onClick: createNote
                    }
                ];
            }

            return [
                {
                    label: 'Create Note',
                    onClick: createNote
                }
            ];
        }
    };

    const onConnectStart = useCallback(() => {
        document.body.classList.add('is-connecting');
    }, []);

    const onConnectEnd = useCallback(() => {
        document.body.classList.remove('is-connecting');
    }, []);

    return (
        <div
            style={{ width: '100vw', height: '100vh' }}
            ref={reactFlowWrapper}
            className={connectionMode ? 'connection-mode' : ''}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >

            <ReactFlow
                nodes={displayNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onNodeClick={onNodeClick}
                onNodeDoubleClick={onNodeDoubleClick}
                onNodeDragStart={onNodeDragStart}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                onContextMenu={onContextMenu}
                onNodeContextMenu={onNodeContextMenu}
                onPaneClick={onPaneClick}
                onMoveEnd={onMoveEnd}
                nodeTypes={nodeTypes}
                snapToGrid={false}
                snapGrid={[40, 40]}
                nodeOrigin={[0.5, 0.5]}
                connectionLineType={ConnectionLineType.Straight}
                // Zoom Lock Logic
                zoomOnScroll={!zoomLocked}
                zoomOnPinch={!zoomLocked}
                zoomOnDoubleClick={!zoomLocked}
            // Remove fitView prop to prevent auto-fit on init if we have a saved viewport
            >
                <Controls showInteractive={false}>
                    <ControlButton onClick={() => setZoomLocked(!zoomLocked)} title={zoomLocked ? "Unlock Zoom" : "Lock Zoom"}>
                        {zoomLocked ? (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                            </svg>
                        )}
                    </ControlButton>
                </Controls>
                <MiniMap
                    nodeColor={(n) => {
                        if (n.type === 'station') return n.data.color || '#007fd4';
                        return '#eee';
                    }}
                    nodeStrokeWidth={3}
                    nodeStrokeColor={(n) => {
                        if (n.type === 'station') return n.data.color || '#007fd4';
                        return '#fff';
                    }}
                    nodeBorderRadius={50}
                    maskColor="var(--vscode-editor-background)"
                    style={{
                        backgroundColor: 'var(--vscode-editor-background)',
                        border: '1px solid var(--vscode-widget-border)',
                        borderRadius: '8px',
                        height: 150,
                        width: 200
                    }}
                    zoomable
                    pannable
                    onClick={onMiniMapClick}
                />
                {showInactiveStations && (
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={40}
                        size={6}
                        color="var(--vscode-scrollbarSlider-background)"
                    />
                )}
                <Panel position="top-right" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ color: 'var(--vscode-descriptionForeground)', fontSize: '12px', background: 'var(--vscode-editor-background)', padding: '5px 10px', borderRadius: '4px', pointerEvents: 'none', border: '1px solid var(--vscode-widget-border)' }}>
                        Hold <b>Option/Alt</b> to Connect
                    </div>
                    <button
                        onClick={() => {
                            if (zoomLocked) {
                                // If zoom locked, we only center, keeping current zoom
                                const currentZoom = getViewport().zoom;
                                fitView({ duration: 800, minZoom: currentZoom, maxZoom: currentZoom });
                            } else {
                                fitView({ duration: 800 });
                            }
                        }}
                        style={{
                            background: 'var(--vscode-button-secondaryBackground)',
                            color: 'var(--vscode-button-secondaryForeground)',
                            border: '1px solid var(--vscode-button-border)',
                            borderRadius: '4px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        Reset View
                    </button>
                </Panel>
                {menu && (
                    <ContextMenu
                        x={menu.x}
                        y={menu.y}
                        items={getMenuItems()}
                        onClose={() => setMenu(null)}
                    />
                )}
                {showColorPicker && menu?.nodeId && (
                    <ColorPickerModal
                        initialColor={nodes.find(n => n.id === menu.nodeId)?.data.color || '#007fd4'}
                        onApply={(color) => {
                            changeNodeColor(color);
                            setShowColorPicker(false);
                            setMenu(null);
                        }}
                        onCancel={() => setShowColorPicker(false)}
                    />
                )}
            </ReactFlow>
        </div>
    );
};

export default () => (
    <ReactFlowProvider>
        <App />
    </ReactFlowProvider>
);
