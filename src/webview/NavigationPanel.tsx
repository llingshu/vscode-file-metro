import React, { useState } from 'react';
import { Node } from 'reactflow';

interface NavigationPanelProps {
    title: string;
    nodes: Node[];
    type: 'coordinate' | 'task';
    onNavigate: (id: string) => void;
    onToggle?: (id: string) => void;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({ title, nodes, type, onNavigate, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: 'relative', display: 'inline-block', width: '200px' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'var(--vscode-dropdown-background)',
                    color: 'var(--vscode-dropdown-foreground)',
                    border: '1px solid var(--vscode-dropdown-border)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <span>{title} ({nodes.length})</span>
                <span style={{ fontSize: '10px' }}>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginBottom: '4px', // Space if pushing down? No, it's absolute.
                    marginTop: '4px',
                    width: '100%',
                    background: 'var(--vscode-dropdown-background)',
                    border: '1px solid var(--vscode-dropdown-border)',
                    borderRadius: '4px',
                    color: 'var(--vscode-dropdown-foreground)',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                }}>
                    {nodes.length === 0 && (
                        <div style={{ padding: '8px', opacity: 0.7, fontStyle: 'italic' }}>
                            No items found.
                        </div>
                    )}
                    {nodes.map(node => (
                        <div
                            key={node.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '6px 8px',
                                borderBottom: '1px solid var(--vscode-widget-border)',
                                cursor: 'default'
                            }}
                            className="nav-item"
                        >
                            {/* Task Checkbox */}
                            {type === 'task' && onToggle && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggle(node.id);
                                    }}
                                    style={{
                                        marginRight: '8px',
                                        cursor: 'pointer',
                                        width: '16px',
                                        height: '16px',
                                        border: '1px solid var(--vscode-checkbox-border)',
                                        background: node.data.completed ? 'var(--vscode-checkbox-background)' : 'transparent',
                                        borderRadius: '3px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        color: 'var(--vscode-checkbox-foreground)'
                                    }}
                                >
                                    {node.data.completed && '✓'}
                                </div>
                            )}

                            {/* Label / Navigation Target */}
                            <div
                                onClick={() => onNavigate(node.id)}
                                style={{
                                    flex: 1,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                title={node.data.label || 'Unnamed'}
                            >
                                {node.data.label || 'Unnamed'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
