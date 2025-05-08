import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Polygon, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const AreaMapInput = ({ onPolygonChange }) => {
  const [coordinates, setCoordinates] = useState([]);
  const featureGroupRef = useRef();

  const handleCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon') {
      const coords = layer.getLatLngs()[0].map(ll => [ll.lat, ll.lng]);
      setCoordinates(coords);
      onPolygonChange(coords);
    }
  };

  return (
    <MapContainer 
      center={[51.505, -0.09]} 
      zoom={13} 
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={handleCreate}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: true
          }}
        />
        {coordinates.length > 0 && (
          <Polygon positions={coordinates} />
        )}
      </FeatureGroup>
    </MapContainer>
  );
};

export default AreaMapInput;