// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import { ProgressProvider } from './hooks/useProgress.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <AuthProvider>
                <ProgressProvider>
                    <App />
                </ProgressProvider>
            </AuthProvider>
        </HashRouter>
    </React.StrictMode>
);
