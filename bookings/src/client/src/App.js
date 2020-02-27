import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import logo from './plane.png';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div>
          <img className="float-left" src={logo} alt="logo" />
          <div className="float-right center">
            <p className="title-text align-left">Bookings</p>
            <p className="sub-title-text align-left">A MariaDB Smart Transactions Demo</p>
          </div>
          <div style={{clear: "both"}} />
        </div>
      </header>
      <Dashboard />
    </div>
  );
}

export default App;
