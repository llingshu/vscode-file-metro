import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const StationNode = ({ data, selected }: NodeProps) => {
    return (
        <div className={`station-node ${selected ? 'selected' : ''} ${data.status === 'missing' ? 'missing' : ''}`}>
            <Handle type="target" position={Position.Top} className="station-handle" />
            <Handle type="source" position={Position.Bottom} className="station-handle" />

            <div className="station-label">{data.label}</div>
        </div>
    );
};

export default memo(StationNode);
