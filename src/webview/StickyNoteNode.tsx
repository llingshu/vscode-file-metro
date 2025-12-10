import React, { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const StickyNoteNode = ({ id, data, selected }: NodeProps) => {
    const [content, setContent] = useState(data.content || '');

    const onChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(evt.target.value);
        if (data.onContentChange) {
            data.onContentChange(id, evt.target.value);
        }
    }, [id, data]);

    useEffect(() => {
        setContent(data.content || '');
    }, [data.content]);

    const style = {
        backgroundColor: data.color || '#fff740',
        ...data.style
    };

    return (
        <div className={`sticky-note-node ${selected ? 'selected' : ''}`} style={style}>
            <NodeResizer
                minWidth={100}
                minHeight={100}
                isVisible={selected}
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
                className="nodrag"
                value={content}
                onChange={onChange}
                placeholder="Type something..."
                spellCheck={false}
            />
        </div>
    );
};

export default memo(StickyNoteNode);
