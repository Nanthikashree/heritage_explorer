import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

function SiteDetailPage() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5050/sites/${id}`)
      .then(res => res.json())
      .then(data => {
        setSite(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching site:', err);
        setLoading(false);
      });

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [id]);

  const handleListen = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      `${site.name}, located in ${site.location}. ${site.description}`
    );
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!site || site.error) return <div className="not-found">Site not found.</div>;

  const videoId = site.video_url.split('/embed/')[1];

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">&larr; Back to map</Link>
      <h1>{site.name}</h1>
      <p className="detail-location">{site.location}</p>

      <button className="listen-btn" onClick={handleListen}>
        {isSpeaking ? '⏹ Stop Narration' : '🔊 Listen to History'}
      </button>

      <p className="detail-description">{site.description}</p>

      <div className="tips-card">
        <div className="tip">
          <span className="tip-label">Category</span>
          <span className="tip-value">{site.category}</span>
        </div>
        <div className="tip">
          <span className="tip-label">Best Time to Visit</span>
          <span className="tip-value">{site.bestTime}</span>
        </div>
        <div className="tip">
          <span className="tip-label">Suggested Duration</span>
          <span className="tip-value">{site.duration}</span>
        </div>
      </div>

      <h3>Photo Gallery</h3>
      <div className="gallery">
        {site.images.map((img, idx) => (
          <img key={idx} src={img} alt={`${site.name} ${idx + 1}`} />
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