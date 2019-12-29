import React from 'react';
import './App.css';
import DatePicker from './components/DatePicker';
const App: React.FC = () => {
  return (
    <div className="App" style={{padding: 30, background: 'pink', height: '100vh'}}>
      <DatePicker/>
    </div>
  );
}

export default App;
