import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
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
    BackgroundVariant
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

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
            // Debounce save?
        },
        [setNodes]
    );

    const onConnect = useCallback(
        (params: Connection) => {
            const color = METRO_COLORS[Math.floor(Math.random() * METRO_COLORS.length)];
            const newEdge = {
                ...params,
                style: { stroke: color, strokeWidth: 4 },
                type: 'default',
            };
            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges]
    );

    // Handle Messages from Extension
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message.command === 'updateLayout') {
                const layout: MetroLayout = message.layout;
                // Convert MetroLayout to ReactFlow nodes/edges
                const newNodes: Node[] = layout.nodes.map(n => ({
                    id: n.id,
                    type: 'station', // Custom type
                    position: n.position,
                    data: { label: n.label, filePath: n.filePath, status: n.status },
                }));
                setNodes(newNodes);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [setNodes, setEdges]);

    // Save Layout
    useEffect(() => {
        const layout: MetroLayout = {
            nodes: nodes.map(n => ({
                id: n.id,
                type: 'file', // Assuming all are files for now
                filePath: n.data.filePath,
                position: n.position,
                label: n.data.label,
                status: n.data.status
            })),
            groups: [],
            edges: []
        };
        vscode.postMessage({ command: 'saveLayout', layout });
    }, [nodes, edges]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            // Check for VS Code D&D data
            // VS Code sends a list of files in 'text/uri-list'
            const data = event.dataTransfer.getData('text/uri-list');
            if (data) {
                const uris = data.split('\r\n').filter(u => u);
                const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();

                if (reactFlowBounds) {
                    const position = {
                        x: Math.round((event.clientX - reactFlowBounds.left) / 20) * 20,
                        y: Math.round((event.clientY - reactFlowBounds.top) / 20) * 20,
                    };

                    const newNodes = uris.map(uri => {
                        // uri is like file:///path/to/file
                        // We need to convert it to a path
                        // Simple hack for now, better to let extension handle parsing
                        // But we need immediate feedback.
                        // Let's assume file://
                        let filePath = uri;
                        if (filePath.startsWith('file://')) {
                            filePath = decodeURIComponent(filePath.replace('file://', ''));
                        }

                        return {
                            id: uuidv4(),
                            type: 'station',
                            position,
                            data: { label: filePath.split('/').pop(), filePath, status: 'active' },
                        };
                    });

                    setNodes((nds) => nds.concat(newNodes));
                }
            }
        },
        [setNodes]
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        if (node.data.filePath) {
            vscode.postMessage({ command: 'openFile', filePath: node.data.filePath });
        }
    }, []);

    const [menu, setMenu] = useState<{ x: number; y: number, flowPosition: { x: number, y: number } } | null>(null);
    const { project } = useReactFlow();

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
                flowPosition.x = Math.round(flowPosition.x / 20) * 20;
                flowPosition.y = Math.round(flowPosition.y / 20) * 20;

                setMenu({
                    x: event.clientX,
                    y: event.clientY,
                    flowPosition
                });
            }
        },
        [project]
    );

    const onPaneClick = useCallback(() => setMenu(null), []);

    const createNote = useCallback(() => {
        if (menu) {
            vscode.postMessage({ command: 'createNote', position: menu.flowPosition });
            setMenu(null);
        }
    }, [menu]);

    return (
        <div style={{ width: '100vw', height: '100vh' }} ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onContextMenu={onContextMenu}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                snapToGrid={true}
                snapGrid={[20, 20]}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={4}
                    color="#444"
                />
                {menu && (
                    <div
                        style={{
                            position: 'absolute',
                            top: menu.y,
                            left: menu.x,
                            zIndex: 1000,
                            background: '#252526',
                            border: '1px solid #454545',
                            borderRadius: '4px',
                            padding: '4px 0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}
                    >
                        <div
                            style={{
                                padding: '4px 12px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: '#cccccc'
                            }}
                            className="context-menu-item"
                            onClick={createNote}
                        >
                            Create Note
                        </div>
                    </div>
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
