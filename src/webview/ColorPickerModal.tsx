import React, { useState } from 'react';

interface ColorPickerModalProps {
    initialColor: string;
    onApply: (color: string) => void;
    onCancel: () => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ initialColor, onApply, onCancel }) => {
    const [color, setColor] = useState(initialColor);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Select Custom Color</h3>
                <div className="color-picker-container">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="native-color-picker"
                    />
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="hex-input"
                    />
                </div>
                <div className="modal-actions">
                    <button onClick={onCancel} className="modal-btn cancel">Cancel</button>
                    <button onClick={() => onApply(color)} className="modal-btn apply">Apply</button>
                </div>
            </div>
        </div>
    );
};

export default ColorPickerModal;
