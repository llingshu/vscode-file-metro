import React from 'react';

export type ToolType = 'select' | 'hand' | 'sticky' | 'text' | 'shape-rect' | 'shape-circle' | 'group';

interface ToolbarProps {
    activeTool: ToolType;
    onToolChange: (tool: ToolType) => void;
}

const Toolbar = ({ activeTool, onToolChange }: ToolbarProps) => {
    const tools: { id: ToolType; icon: React.ReactNode; label: string }[] = [
        {
            id: 'select',
            label: 'Select',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /></svg>
        },
        {
            id: 'hand',
            label: 'Pan',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></svg>
        },
        {
            id: 'sticky',
            label: 'Sticky Note',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        },
        {
            id: 'text',
            label: 'Text',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
        },
        {
            id: 'shape-rect',
            label: 'Rectangle',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
        },
        {
            id: 'shape-circle',
            label: 'Circle',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
        },
        {
            id: 'group',
            label: 'Group',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
        }
    ];

    return (
        <div className="metro-toolbar">
            {tools.map(tool => (
                <button
                    key={tool.id}
                    className={`metro-tool-btn ${activeTool === tool.id ? 'active' : ''}`}
                    onClick={() => onToolChange(tool.id)}
                    title={tool.label}
                >
                    {tool.icon}
                </button>
            ))}
        </div>
    );
};

export default Toolbar;
