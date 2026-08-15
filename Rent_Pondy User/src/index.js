import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RouterPage from './Components/RouterPage';
import { Provider } from 'react-redux';
import { store } from './red/store';
import { registerBaseInterceptor, syncBaseFromPath } from './utils/cityBase';
import { initActivityTracker } from './utils/activityTracker';
import { initClarity } from './utils/clarity';

// City-base setup: pick up the base from the current URL (handles refresh /
// direct load on /chennai or /pondicherry), then register the axios
// interceptor so every backend call carries the active base.
syncBaseFromPath(window.location.pathname);
registerBaseInterceptor();

// Live activity tracking: records page views + key actions for the admin
// "Live User Activity" screen. Fire-and-forget; never blocks the app.
initActivityTracker();

// Microsoft Clarity — session replays / heatmaps for the public site. Separate
// project from the admin panel. No-op unless REACT_APP_CLARITY_ID is set.
initClarity();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <RouterPage />
    </Provider>
);

reportWebVitals();




// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <div className="safe-area-container">
//     <Provider store={store}>
//       <RouterPage />
//     </Provider>
//   </div>
// );
//  reportWebVitals();

