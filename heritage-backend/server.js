const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5050;

app.use(cors());

// Load sites data from JSON file
function loadSites() {
  const dataPath = path.join(__dirname, 'data', 'sites.json');
  const rawData = fs.readFileSync(dataPath);
  return JSON.parse(rawData);
}

// GET /sites -> lightweight list for map pins
app.get('/sites', (req, res) => {
  const sites = loadSites();
  const summary = sites.map(site => ({
    id: site.id,
    name: site.name,
    location: site.location,
    lat: site.lat,
    lng: site.lng,
    category: site.category,
    duration: site.duration
  }));
  res.json(summary);
});

// GET /sites/:id -> full detail for one site
app.get('/sites/:id', (req, res) => {
  const sites = loadSites();
  const site = sites.find(s => s.id === req.params.id);
  if (!site) {
    return res.status(404).json({ error: 'Site not found' });
  }
  res.json(site);
});

app.listen(PORT, () => {
  console.log(`Heritage Explorer backend running on http://localhost:${PORT}`);
});