import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const ShapeNode = ({ id, data, selected }: NodeProps) => {
    const shapeType = data.shapeType || 'rect';
    const style = {
        stroke: data.color || 'var(--vscode-editor-foreground)',
        strokeWidth: 2,
        fill: data.style?.backgroundColor || 'transparent',
        ...data.style
    };

    return (
        <div className={`shape-node ${selected ? 'selected' : ''}`} style={{ width: '100%', height: '100%' }}>
            <NodeResizer
                isVisible={selected}
                minWidth={50}
                minHeight={50}
                lineClassName="react-flow__resize-control-line"
                handleClassName="react-flow__resize-control-handle"
            />

            {/* Handles for connections */}
            <Handle type="target" position={Position.Top} className="station-handle center target" />
            <Handle type="source" position={Position.Top} className="station-handle center source" />
            <Handle type="target" position={Position.Bottom} className="station-handle center target" />
            <Handle type="source" position={Position.Bottom} className="station-handle center source" />
            <Handle type="target" position={Position.Left} className="station-handle center target" />
            <Handle type="source" position={Position.Left} className="station-handle center source" />
            <Handle type="target" position={Position.Right} className="station-handle center target" />
            <Handle type="source" position={Position.Right} className="station-handle center source" />

            <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                {shapeType === 'rect' && (
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        rx="4"
                        ry="4"
                        style={style}
                    />
                )}
                {shapeType === 'circle' && (
                    <ellipse
                        cx="50%"
                        cy="50%"
                        rx="50%"
                        ry="50%"
                        style={style}
                    />
                )}
            </svg>
        </div>
    );
};

export default memo(ShapeNode);
