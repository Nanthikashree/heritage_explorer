import { useParams } from 'react-router-dom';

function SiteDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <h1>Site Detail Page</h1>
      <p>Showing details for: {id}</p>
      <p>Description, gallery, video go here (Varsha builds this)</p>
    </div>
  );
}

export default SiteDetailPage;