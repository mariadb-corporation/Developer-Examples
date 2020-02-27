import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <p className="title-text">Real-Time Flight Analytics</p>
        <p className="sub-title-text">A MariaDB ColumnStore Demo</p>
      </header>
      <Dashboard />
    </div>
  );
}

export default App;
