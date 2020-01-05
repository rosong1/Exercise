import React from 'react';
import './App.css';
import DatePicker from './components/DatePicker';
const App: React.FC = () => {
  const [date, setDate] = React.useState('2020-01-02');
  return (
    <div className="App" style={{padding: 30, background: 'pink', height: '100vh'}}>
      <DatePicker onDateChange={(...args) => {console.log(args); }}/>
      <DatePicker value={date} onDateChange={setDate}/>
    </div>
  );
}

export default App;
