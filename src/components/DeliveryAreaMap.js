import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Container } from '@mui/material';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapView({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length === 2) {
      map.flyToBounds(bounds, {
        padding: [50, 50],
        duration: 1
      });
    }
  }, [bounds, map]);

  return null;
}

const DeliveryAreaMap = ({ deliveryPersonnelId }) => {
  const [deliveryArea, setDeliveryArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef();
  
  const defaultCenter = [31.9454, 35.9284];
  const defaultZoom = 10;

  useEffect(() => {
    const fetchDeliveryArea = async () => {
      try {
        const {data} = await axios.get(`http://localhost:5000/api/delivery-area`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        }
        );
        
        setDeliveryArea(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryArea();
  }, [deliveryPersonnelId]);

  if (loading) return <div>Loading delivery area...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deliveryArea) return <div>No delivery area assigned</div>;

  return (
    <Container maxWidth="md">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '500px', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {deliveryArea?.geojson && (
          <>
            <GeoJSON
              key={deliveryArea.id}
              data={deliveryArea.geojson}
              style={{
                fillColor: '#3388ff',
                weight: 2,
                opacity: 1,
                color: '#3388ff',
                fillOpacity: 0.2
              }}
            />
            <MapView bounds={deliveryArea.bounds} />
          </>
        )}
      </MapContainer>
    </Container>
  );
};

export default DeliveryAreaMap;