import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function SiteDetailPage() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/sites/${id}`)
      .then(res => res.json())
      .then(data => {
        setSite(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching site:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!site || site.error) return <div className="not-found">Site not found.</div>;
  const videoId = site.video_url.split('/embed/')[1];

    return (
    <div className="detail-container">
      <Link to="/" className="back-link">&larr; Back to map</Link>
      <h1>{site.name}</h1>
      <p className="detail-location">{site.location}</p>
      <p className="detail-description">{site.description}</p>

      <h3>Photo Gallery</h3>
      <div className="gallery">
        {site.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${site.name} ${idx + 1}`}
          />
        ))}
      </div>

      <h3>Video Tour</h3>
      <div className="video-wrapper">
        <iframe
          width="100%"
          height="450"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Video tour"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default SiteDetailPage;