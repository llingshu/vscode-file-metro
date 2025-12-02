import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactFlowProvider } from 'reactflow';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <ReactFlowProvider>
            <App />
        </ReactFlowProvider>
    );
}
