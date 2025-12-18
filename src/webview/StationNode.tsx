import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const StationNode = ({ id, data, selected }: NodeProps) => {
    const style = data.color ? {
        borderColor: data.color,
        boxShadow: `0 0 0 2px ${data.color}33`, // Subtle glow with same color
        backgroundColor: data.completed ? data.color : undefined, // Solid fill if completed
        color: data.completed ? '#ffffff' : undefined // White text if filled (assuming dark colors)
    } : {};

    return (
        <div
            className={`station-node ${selected ? 'selected' : ''} ${data.status === 'missing' ? 'missing' : ''} ${data.isConnectionMode ? 'connection-target' : ''} ${data.isGhost ? 'ghost' : ''} ${data.mark === 'task' ? 'is-task' : ''} ${data.completed ? 'completed' : ''}`}
            style={style}
            onAuxClick={(e) => {
                // Middle Click (Button 1)
                if (e.button === 1) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (data.onRename && data.filePath) {
                        data.onRename(id, data.filePath);
                    }
                }
            }}
        >
            {/* Center handles for straight lines from middle */}
            <Handle
                type="target"
                position={Position.Top}
                className="station-handle center target"
            />
            <Handle
                type="source"
                position={Position.Top}
                className="station-handle center source"
            />



            <div className="station-label">{data.label}</div>

            {data.mark && data.mark !== 'none' && (
                <div
                    className={`station-mark mark-${data.mark}`}
                    style={{ backgroundColor: data.mark === 'default' ? data.color : undefined }}
                >
                    {data.mark === 'check' && '✓'}
                    {data.mark === 'star' && '★'}
                    {data.mark === 'coordinate' && (
                        <div style={{ color: data.color || 'var(--vscode-editor-foreground)' }}>
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ display: 'block' }}>
                                <circle cx="12" cy="12" r="6" />
                                <line x1="12" y1="0" x2="12" y2="24" />
                                <line x1="0" y1="12" x2="24" y2="12" />
                            </svg>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default memo(StationNode);
