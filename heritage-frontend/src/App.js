import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SiteDetailPage from './pages/SiteDetailPage';
import TripPlannerPage from './pages/TripPlannerPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/site/:id" element={<SiteDetailPage />} />
        <Route path="/trip" element={<TripPlannerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;