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
    const [activeSubmenuIndex, setActiveSubmenuIndex] = useState<number | null>(null);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const openTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleItemMouseEnter = (index: number) => {
        // If we are entering an item, we should cancel any pending "close all" from leaving the menu
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // Always clear any pending switch to another item (e.g. if we crossed B to get back to A/Submenu A)
        if (openTimeoutRef.current) {
            clearTimeout(openTimeoutRef.current);
            openTimeoutRef.current = null;
        }

        // If we are already on this item, do nothing further
        if (activeSubmenuIndex === index) return;

        // Debounce switching items to allow "diagonal" movement
        // If we are switching from A to B, keep A open for a short delay
        openTimeoutRef.current = setTimeout(() => {
            setActiveSubmenuIndex(index);
        }, 100);
    };

    const handleItemMouseLeave = () => {
        // If we leave the menu entirely (or the item), schedule a close
        // But wait... this is on the PARENT container.

        if (openTimeoutRef.current) {
            clearTimeout(openTimeoutRef.current);
            openTimeoutRef.current = null;
        }

        timeoutRef.current = setTimeout(() => {
            setActiveSubmenuIndex(null);
        }, 800);
    };

    return (
        <div
            className="context-menu"
            style={{ top: y, left: x }}
            onMouseLeave={handleItemMouseLeave}
            onMouseEnter={() => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                // Also clear open timeout if we re-entered the general menu area?
                // Actually handleItemMouseEnter covers specific items.
                // This handler is for the global container.
            }}
        >
            {items.map((item, index) => (
                <ContextMenuItem
                    key={index}
                    item={item}
                    isActive={activeSubmenuIndex === index}
                    onMouseEnter={() => handleItemMouseEnter(index)}
                    onMouseLeave={handleItemMouseLeave}
                />
            ))}
        </div>
    );
};

const ContextMenuItem: React.FC<{
    item: MenuItem;
    isActive: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}> = ({ item, isActive, onMouseEnter, onMouseLeave }) => {
    return (
        <div
            className={`context-menu-item ${item.danger ? 'danger' : ''}`}
            onClick={() => {
                if (item.onClick) {
                    item.onClick();
                }
            }}
            onMouseEnter={onMouseEnter}
        // We don't need onMouseLeave here because the parent handles the "global" leave,
        // and switching items is handled by the next item's onMouseEnter.
        // However, if we leave the item and go to "nowhere" (outside menu), we need to close.
        // But the parent ContextMenu has onMouseLeave.
        // Wait, if we leave Item A and go to Item B, Parent is still hovered.
        // If we leave Item A and go outside Parent, Parent onMouseLeave triggers.
        // So we actually don't need onMouseLeave on the item itself for closing logic if Parent handles it?
        // Actually, we want the submenu to stay open if we are inside the submenu.
        // The submenu is a child of the item. So leaving item means leaving submenu too.
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

            {item.submenu && isActive && (
                <div
                    className="context-submenu"
                    onMouseEnter={onMouseEnter}
                >
                    {item.submenu.map((subItem, index) => (
                        <ContextMenuItem
                            key={index}
                            item={subItem}
                            isActive={false} // Nested submenus not fully supported in this simple refactor yet, or need recursion
                            onMouseEnter={() => { }}
                            onMouseLeave={() => { }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContextMenu;
