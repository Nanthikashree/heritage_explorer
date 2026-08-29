import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function HomePage() {
  const [sites, setSites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5050/sites')
      .then(res => res.json())
      .then(data => setSites(data))
      .catch(err => console.error('Error fetching sites:', err));
  }, []);

  const categories = ['All', ...new Set(sites.map(s => s.category))];

  const filteredSites = selectedCategory === 'All'
    ? sites
    : sites.filter(s => s.category === selectedCategory);

  const handleSurpriseMe = () => {
    if (sites.length === 0) return;
    const random = sites[Math.floor(Math.random() * sites.length)];
    navigate(`/site/${random.id}`);
  };

  return (
    <div>
      <div className="home-header">
        <h1>Heritage Explorer</h1>
        <p>Discover India's Cultural Treasures</p>

        <div className="controls-bar">
          <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button className="surprise-btn" onClick={handleSurpriseMe}>
            🎲 Surprise Me
          </button>

          <Link to="/trip" className="trip-btn">
            🗺️ Plan My Trip
          </Link>
        </div>
      </div>

      <MapContainer center={[22.5, 79]} zoom={5} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {filteredSites.map(site => (
          <Marker
            key={site.id}
            position={[site.lat, site.lng]}
            eventHandlers={{
              click: () => navigate(`/site/${site.id}`)
            }}
          >
            <Popup>{site.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default HomePage;