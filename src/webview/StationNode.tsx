import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const StationNode = ({ id, data, selected }: NodeProps) => {
    const style = data.color ? {
        borderColor: data.color,
        boxShadow: `0 0 0 2px ${data.color}33`, // Subtle glow with same color
        // Solid fill if completed OR if mark is 'none' (or undefined)
        // Mark 'blank' (or 'hollow') explicitly makes it hollow (undefined bg)
        backgroundColor: (data.completed || !data.mark || data.mark === 'none') ? data.color : undefined,
        color: (data.completed || !data.mark || data.mark === 'none') ? '#ffffff' : undefined // White text if filled
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
                    style={{
                        backgroundColor: data.mark === 'default' ? data.color : undefined,
                        borderColor: (data.mark === 'hollow' || data.mark === 'blank') ? data.color : undefined
                    }}
                >
                    {data.mark === 'check' && '✓'}
                    {data.mark === 'star' && '★'}
                    {data.mark === 'coordinate' && (
                        <div style={{ color: data.color || 'var(--vscode-editor-foreground)' }}>
                            {/* Phase 15: Concentric Circles Design (Sharpened) */}
                            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
                            </svg>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default memo(StationNode);
