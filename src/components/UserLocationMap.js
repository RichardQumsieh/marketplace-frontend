import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

const UserLocationMap = ({position = [0,0], accuracy = null}) => {

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

    if (!position) {
        return <div>Loading your location...</div>;
    }

    L.Marker.prototype.options.icon = DefaultIcon;

    function AutoCenterMap({ coords }) {
        const map = useMap();
        useEffect(() => {
            map.flyTo(coords, map.getZoom());
        }, [coords, map]);
        return null;
    }

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        {accuracy && (
            <Circle
                center={position}
                radius={accuracy}
                color="blue"
                fillOpacity={0.1}
            />
        )}
        <AutoCenterMap coords={position} />
        <Popup>
          Your current location <br />
          Accuracy: {accuracy ? `${accuracy.toFixed(0)} meters` : 'Unknown'}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default UserLocationMap;