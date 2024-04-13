import React from 'react'
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import marker1 from '@/assets/marker-icons/marker1.png';

const MapComponent = () => {

    const position = [51.505, -0.09];  // Default center position

    // LocationMarker component
    function LocationMarker() {
        const map = useMapEvents({
            click(e) {                                  // Event handler
                const { lat, lng } = e.latlng;          // Get the latitude and longitude
                L.marker([lat, lng]).addTo(map);        // Add a marker to the map
            },
        });
        return null;
    }

    // Marker data 
    const markers = [
        {
            id: 1,
            position: [51.505, -0.09],
            text: 'London'
        },
        {
            id: 2,
            position: [51.505, -0.1],
            text: 'London'
        },
        {
            id: 3,
            position: [51.505, -0.11],
            text: 'London'
        }
    ];

    // use react icons
    const customIcon = new Icon({
        iconUrl: marker1,
        iconSize: [40, 40],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
    });

    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100vh', width: '100%' }}
        >
            {/* TileLayer component */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                    OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />

            {/* LocationMarker component */}
            <LocationMarker />

            {/* Marker component */}
            {markers.map(marker => (
                <Marker key={marker.id} position={marker.position} icon={customIcon}>
                    <Popup>
                        <div className='text-[36px]'>{marker.text}</div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default MapComponent

