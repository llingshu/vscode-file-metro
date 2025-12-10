import React, { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const TextNode = ({ id, data, selected }: NodeProps) => {
    const [content, setContent] = useState(data.content || 'Text');

    const onChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(evt.target.value);
        if (data.onContentChange) {
            data.onContentChange(id, evt.target.value);
        }
    }, [id, data]);

    useEffect(() => {
        setContent(data.content || 'Text');
    }, [data.content]);

    const style = {
        color: data.color || 'var(--vscode-editor-foreground)',
        fontSize: data.style?.fontSize || 16,
        textAlign: data.style?.textAlign || 'left',
        ...data.style
    };

    return (
        <div className={`text-node ${selected ? 'selected' : ''}`} style={{ minWidth: 100, minHeight: 30 }}>
            <NodeResizer
                isVisible={selected}
                minWidth={50}
                minHeight={30}
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

            <textarea
                className="nodrag text-node-input"
                value={content}
                onChange={onChange}
                placeholder="Type something..."
                spellCheck={false}
                style={style}
            />
        </div>
    );
};

export default memo(TextNode);
