import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store/store';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            fontFamily: '"DM Sans", sans-serif',
            background: '#2C1F12',
            color: '#FAF7F2',
            borderRadius: '100px',
            padding: '0.75rem 1.4rem',
            fontSize: '0.85rem',
          },
          duration: 3000,
        }}
      />
    </Provider>
  </React.StrictMode>
);
