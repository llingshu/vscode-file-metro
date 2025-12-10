export interface MetroNode {
    id: string;
    type: 'file' | 'station' | 'sticky' | 'text' | 'shape' | 'group';
    filePath?: string; // Absolute path (for files)
    position: { x: number; y: number };
    label?: string;
    parentId?: string; // For groups
    status?: 'active' | 'missing';
    color?: string; // Custom color or background color
    mark?: 'none' | 'default' | 'check' | 'star';

    // Whiteboard specific
    content?: string; // Markdown content for notes/text
    shapeType?: 'rect' | 'circle';
    width?: number;
    height?: number;
    style?: {
        backgroundColor?: string;
        borderColor?: string;
        borderStyle?: string;
        borderWidth?: number;
        borderRadius?: number;
        fontSize?: number;
        textAlign?: 'left' | 'center' | 'right';
    };
}

export interface MetroEdge {
    id: string;
    source: string;
    target: string;
    style?: any;
}

export interface MetroLayout {
    nodes: MetroNode[];
    edges: MetroEdge[];
    viewport?: { x: number; y: number; zoom: number };
    zoomLocked?: boolean;
}
