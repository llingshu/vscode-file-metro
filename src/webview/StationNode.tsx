import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const StationNode = ({ id, data, selected }: NodeProps) => {
    const style = data.color ? {
        borderColor: data.color,
        boxShadow: `0 0 0 2px ${data.color}33` // Subtle glow with same color
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
                    {/* Coordinate mark uses CSS pseudo-elements */}
                </div>
            )}
        </div>
    );
};

export default memo(StationNode);
