import React, { memo, useState, useCallback } from 'react';
import { NodeProps, NodeResizer } from 'reactflow';

const GroupNode = ({ id, data, selected }: NodeProps) => {
    const [label, setLabel] = useState(data.label || 'Group');

    const onLabelChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(evt.target.value);
        if (data.onLabelChange) {
            data.onLabelChange(id, evt.target.value);
        }
    }, [id, data]);

    const style = {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '2px dashed var(--vscode-editor-foreground)',
        borderRadius: 8,
        ...data.style
    };

    return (
        <div className={`group-node ${selected ? 'selected' : ''}`} style={{ width: '100%', height: '100%', ...style }}>
            <NodeResizer
                isVisible={selected}
                minWidth={100}
                minHeight={100}
                lineClassName="react-flow__resize-control-line"
                handleClassName="react-flow__resize-control-handle"
            />

            <div className="group-label" style={{ position: 'absolute', top: -25, left: 0 }}>
                <input
                    className="nodrag"
                    value={label}
                    onChange={onLabelChange}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--vscode-editor-foreground)',
                        fontSize: 14,
                        fontWeight: 'bold',
                        outline: 'none'
                    }}
                />
            </div>
        </div>
    );
};

export default memo(GroupNode);
