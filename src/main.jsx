// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ProgressProvider } from './hooks/useProgress.jsx';
import App from './App.jsx';
import './index.css';

// HashRouter is used (not BrowserRouter) so deep links and refreshes
// work on GitHub Pages without server-side rewrite rules.
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <ProgressProvider>
                <App />
            </ProgressProvider>
        </HashRouter>
    </React.StrictMode>
);