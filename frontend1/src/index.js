import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global CSS (for font imports, basic resets)
import RootApp from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with ID "root" not found in the DOM.');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);