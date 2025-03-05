import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import PlayerSelection from './Test_PlayerSelection_2.jsx';
import PlayerSelectionCustom from './Test_PlayerSelection_3.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlayerSelection/>
    <App />
  </StrictMode>
); 
