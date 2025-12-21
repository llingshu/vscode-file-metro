export interface MetroNode {
    id: string;
    type: 'file' | 'note';
    filePath: string; // Absolute path
    position: { x: number; y: number };
    label?: string;
    parentId?: string; // For groups
    status?: 'active' | 'missing';
    color?: string; // Custom color
    mark?: 'none' | 'default' | 'check' | 'star' | 'coordinate' | 'task';
    completed?: boolean;
    completedAt?: number; // Timestamp for archiving logic
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
    label?: string; // Connection annotation
}

export interface MetroLayout {
    nodes: MetroNode[];
    groups: MetroGroup[];
    edges: MetroEdge[];
    viewport?: { x: number; y: number; zoom: number };
    zoomLocked?: boolean;
}
