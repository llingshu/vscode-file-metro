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
                color: n.data.color // Save color
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
                console.log('Received updateLayout message');
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
                console.log('Purged ghost nodes from state');
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
        // Single click selects the node (handled by ReactFlow default), no file open
    }, []);

    const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
        if (node.data.filePath) {
            vscode.postMessage({ command: 'openFile', filePath: node.data.filePath });
        }
    }, []);

    // Restore viewport on load
    useEffect(() => {
        if (isLoaded && nodes.length > 0) {
            // We need to wait for nodes to be rendered? 
            // Actually, we should restore viewport from the layout message
        }
    }, [isLoaded]);

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
            if (node) {
                // Simple prompt for now, could be a custom UI
                // Since we can't use window.prompt in VSCode webview easily without blocking, 
                // we'll just use a quick hack or assume we can't do it nicely yet.
                // Actually, let's just use the VS Code API if possible or a custom input in the menu.
                // For this step, I'll add an input field to the menu.
            }
        }
    }, [menu, nodes]);



    const onNodeDragStart = useCallback((event: React.MouseEvent, node: Node) => {
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
            type: 'station'
        }]);
    }, [setNodes]);

    const onNodeDrag = useCallback((event: React.MouseEvent, node: Node) => {
        const pane = reactFlowWrapper.current?.getBoundingClientRect();
        if (pane) {
            const flowPos = project({
                x: event.clientX - pane.left,
                y: event.clientY - pane.top
            });

            setShadowNodes(prev => prev.map(g => ({
                ...g,
                position: flowPos
            })));
        }
    }, [project]);

    const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
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
    }, [setNodes, saveLayout]);

    // Merge nodes with shadow nodes for rendering
    // Shadows should be behind
    const displayNodes = [...shadowNodes, ...(dragGhost ? [dragGhost] : []), ...nodes];

    const deleteNode = useCallback(() => {
        if (menu && menu.nodeId) {
            setNodes((nds) => {
                const updated = nds.filter(n => n.id !== menu.nodeId);
                setTimeout(() => saveLayout(), 0);
                return updated;
            });
            // Also remove connected edges
            setEdges((eds) => eds.filter(e => e.source !== menu.nodeId && e.target !== menu.nodeId));
            setMenu(null);
        }
    }, [menu, setNodes, setEdges, saveLayout]);

    // Menu Items Configuration
    const getMenuItems = (): MenuItem[] => {
        if (!menu) return [];

        if (menu.nodeId) {
            return [
                {
                    label: 'Rename',
                    onClick: renameNode
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
            // Remove fitView prop to prevent auto-fit on init if we have a saved viewport
            >
                <Controls>
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
                    maskColor="rgba(0, 0, 0, 0.6)"
                    style={{
                        backgroundColor: '#1e1e1e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        height: 150,
                        width: 200
                    }}
                    zoomable
                    pannable
                    onClick={onMiniMapClick}
                />
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={40}
                    size={10}
                    color="#333"
                />
                <Panel position="top-right" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ color: '#aaa', fontSize: '12px', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px', pointerEvents: 'none' }}>
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
                            background: '#252526',
                            color: '#cccccc',
                            border: '1px solid #454545',
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
