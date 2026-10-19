import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from "../src/redux/app/Store.js";
import { Provider } from 'react-redux';
import { logout } from "../src/redux/features/userSlice";

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// const handleBeforeUnload = () => {
//   console.log("handleBeforeUnload called");
//   // Dispatch the action to clear the authentication state
//   store.dispatch(logout());
//   console.log("clearAuthState dispatched");
// };

// Add event listener for beforeunload
// window.addEventListener('beforeunload', handleBeforeUnload);

///UNCOMMENT THE BLOCK OF CODE ABOVE FOR TOKEN LOGOUT ON REFRESH

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// Unregister the event listener when the component is unmounted
// const unmountCallback = root.unmount;
// root.unmount = function (...args) {
//   console.log("Unmounting component");
//   window.removeEventListener('beforeunload', handleBeforeUnload);
//   unmountCallback.apply(this, args);
// };

///UNCOMMENT THE BLOCK OF CODE ABOVE FOR TOKEN LOGOUT ON REFRESH
