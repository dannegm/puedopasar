import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { settings } from '@/services/settings';

import './index.css';
import App from './app.jsx';

settings.registerDevTools();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
