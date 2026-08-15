

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';  // import your store
import App from './App';
import { registerAdminBaseInterceptor } from './utils/adminBase';
import { initClarity } from './utils/clarity';

// Attach the admin's city-base scope (ALL/PY/CH) to every backend request.
registerAdminBaseInterceptor();

// Microsoft Clarity — admin session replays / heatmaps. No-op unless
// REACT_APP_CLARITY_ID is set in .env (see utils/clarity.js).
initClarity();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
