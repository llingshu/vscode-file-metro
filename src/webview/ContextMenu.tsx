import React, { useState } from 'react';

export interface MenuItem {
    label: string;
    onClick?: () => void;
    submenu?: MenuItem[];
    color?: string; // For color preview
    danger?: boolean; // For delete action
}

interface ContextMenuProps {
    x: number;
    y: number;
    items: MenuItem[];
    onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
    return (
        <div
            className="context-menu"
            style={{ top: y, left: x }}
            onMouseLeave={onClose}
        >
            {items.map((item, index) => (
                <ContextMenuItem key={index} item={item} />
            ))}
        </div>
    );
};

const ContextMenuItem: React.FC<{ item: MenuItem }> = ({ item }) => {
    const [showSubmenu, setShowSubmenu] = useState(false);

    return (
        <div
            className={`context-menu-item ${item.danger ? 'danger' : ''}`}
            onClick={() => {
                if (item.onClick) {
                    item.onClick();
                }
            }}
            onMouseEnter={() => setShowSubmenu(true)}
            onMouseLeave={() => setShowSubmenu(false)}
        >
            <div className="menu-item-content">
                {item.color && (
                    <span
                        className="color-preview"
                        style={{ backgroundColor: item.color }}
                    />
                )}
                <span>{item.label}</span>
            </div>
            {item.submenu && <span className="submenu-arrow">›</span>}

            {item.submenu && showSubmenu && (
                <div className="context-submenu">
                    {item.submenu.map((subItem, index) => (
                        <ContextMenuItem key={index} item={subItem} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContextMenu;
