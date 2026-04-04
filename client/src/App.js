import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScannerPage from './pages/ScannerPage';
import SolutionPage from './pages/SolutionPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ScannerPage />} />
      <Route path="/solutions" element={<SolutionPage />} />
    </Routes>
  </Router>
);

export default App;
