import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SiteDetailPage from './pages/SiteDetailPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/site/:id" element={<SiteDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;