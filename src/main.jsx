import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import RainbowUnicornReveal from './components/Unicorn.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RainbowUnicornReveal />
    <App />
  </StrictMode>
);

// const root = createRoot(document.getElementById('root'));
// root.render(<App />);
 