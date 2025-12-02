import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const StationNode = ({ data, selected }: NodeProps) => {
    const style = data.color ? {
        borderColor: data.color,
        boxShadow: `0 0 0 2px ${data.color}33` // Subtle glow with same color
    } : {};

    return (
        <div
            className={`station-node ${selected ? 'selected' : ''} ${data.status === 'missing' ? 'missing' : ''} ${data.isConnectionMode ? 'connection-target' : ''} ${data.isGhost ? 'ghost' : ''}`}
            style={style}
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
        </div>
    );
};

export default memo(StationNode);
