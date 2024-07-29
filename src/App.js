import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Patients from './pages/Patients';
import Records from './pages/Records';
import Odontograms from './pages/Odontograms';
import Factures from './pages/Factures';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/records" element={<Records />} />
          <Route path="/odontograms" element={<Odontograms />} />
          <Route path="/factures" element={<Factures />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
