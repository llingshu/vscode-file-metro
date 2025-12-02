export interface MetroNode {
    id: string;
    type: 'file' | 'note';
    filePath: string; // Absolute path
    position: { x: number; y: number };
    label?: string;
    parentId?: string; // For groups
    status?: 'active' | 'missing';
    color?: string; // Custom color
}

export interface MetroGroup {
    id: string;
    label: string;
    position: { x: number; y: number };
    width: number;
    height: number;
    style?: any;
}

export interface MetroEdge {
    id: string;
    source: string;
    target: string;
}

export interface MetroLayout {
    nodes: MetroNode[];
    groups: MetroGroup[];
    edges: MetroEdge[];
    viewport?: { x: number; y: number; zoom: number };
    zoomLocked?: boolean;
}
