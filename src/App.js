import './App.css';
import './components/blog/calendar/Calendar.scss';
// import Calendar from './components/blog/calendar/Calendar.jsx'
import { Register } from './pages'
import React from "react";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<Register />} />
            {/*<Route path="/Confirmation" element={<Confirmation />} />*/}
        </Routes>
      {/* <Calendar/> */}
       </div>
  );
}

export default App;

