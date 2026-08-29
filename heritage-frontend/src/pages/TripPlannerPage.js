import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function buildRoute(sites) {
  if (sites.length === 0) return [];
  const remaining = [...sites];
  const route = [remaining.shift()];

  while (remaining.length > 0) {
    const last = route[route.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((site, idx) => {
      const dist = getDistance(last.lat, last.lng, site.lat, site.lng);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = idx;
      }
    });
    route.push(remaining[nearestIdx]);
    remaining.splice(nearestIdx, 1);
  }
  return route;
}

function estimateTravelTime(km) {
  const hours = km / 50;
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function TripPlannerPage() {
  const [allSites, setAllSites] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5050/sites')
      .then(res => res.json())
      .then(data => setAllSites(data))
      .catch(err => console.error('Error fetching sites:', err));
  }, []);

  const toggleSite = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const generateTrip = () => {
    const selectedSites = allSites.filter(s => selectedIds.includes(s.id));
    const ordered = buildRoute(selectedSites);
    setRoute(ordered);
  };

  const totalDistance = route.reduce((sum, site, idx) => {
    if (idx === 0) return sum;
    const prev = route[idx - 1];
    return sum + getDistance(prev.lat, prev.lng, site.lat, site.lng);
  }, 0);

  return (
    <div className="trip-container">
      <Link to="/" className="back-link-inline">&larr; Back to map</Link>
      <h1>Plan My Heritage Trip</h1>
      <p className="trip-subtitle">Select the sites you want to visit — we'll suggest the best order.</p>

      <div className="site-checklist">
        {allSites.map(site => (
          <label key={site.id} className="site-check-item">
            <input
              type="checkbox"
              checked={selectedIds.includes(site.id)}
              onChange={() => toggleSite(site.id)}
            />
            {site.name} <span className="site-check-location">({site.location})</span>
          </label>
        ))}
      </div>

      <button
        className="generate-btn"
        onClick={generateTrip}
        disabled={selectedIds.length < 2}
      >
        Generate My Route ({selectedIds.length} selected)
      </button>

      {route.length > 0 && (
        <div className="route-result">
          <div className="route-summary">
            <h3>Suggested Itinerary</h3>
            <span className="total-distance">Total: {totalDistance.toFixed(0)} km</span>
          </div>

          <div className="timeline-horizontal">
            {route.map((site, idx) => {
              const prev = idx > 0 ? route[idx - 1] : null;
              const legDistance = prev
                ? getDistance(prev.lat, prev.lng, site.lat, site.lng)
                : null;

              return (
                <div className="h-timeline-item" key={site.id}>
                  {legDistance !== null && (
                    <div className="h-connector">
                      <span className="h-connector-line"></span>
                      <span className="h-connector-label">
                        {legDistance.toFixed(0)} km &middot; ~{estimateTravelTime(legDistance)}
                      </span>
                      <span className="h-connector-line"></span>
                    </div>
                  )}
                  <div className="h-stop-card">
                    <div className="h-stop-dot">{idx + 1}</div>
                    <Link to={`/site/${site.id}`} className="h-stop-title">{site.name}</Link>
                    <div className="h-stop-meta">{site.location}</div>
                    <div className="h-stop-duration">{site.duration}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default TripPlannerPage;