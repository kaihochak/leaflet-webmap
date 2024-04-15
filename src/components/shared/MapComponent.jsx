import React from 'react'
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { DEFAULT_POSITION, MARKERS, CUSTOM_ICON } from '@/config/mapConfig';

const MapComponent = () => {

    const [markers, setMarkers] = React.useState(MARKERS);


    /************************************************************
     * This function is a custom hook that creates a cluster icon
     ************************************************************/

    const CreateClusterCustomIcon = (cluster) => {
        const count = cluster.getChildCount();
        let size = 'LargeXL';
        if (count < 5) {
            size = 'Small';
        } else if (count < 20) {
            size = 'Medium';
        } else if (count < 100) {
            size = 'Large';
        }
        return L.divIcon({
            html: `<div><span>${count}</span></div>`,
            className: `marker-cluster marker-cluster-${size}`,
            iconSize: L.point(40, 40, true),
        });
    }

    /************************************************************
     * This function is a custom hook that adds a marker to the map
     ************************************************************/

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setMarkers([...markers, { id: markers.length + 1, position: [e.latlng.lat, e.latlng.lng], text: 'New Marker' }]);
            },
        });
        return null;
    };

    /************************************************************
     * RENDERING
     ************************************************************/

    return (
        <MapContainer
            center={DEFAULT_POSITION}
            zoom={8}
            style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                    OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />

            <LocationMarker />

            {/* MarkerClusterGroup: it groups markers into clusters */}
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={CreateClusterCustomIcon}
            >
                {/* Markers: it displays markers on the map */}
                {markers.map(marker => (
                    <Marker key={marker.id} position={marker.position} icon={CUSTOM_ICON}>
                        <Popup>
                            <div className='text-[36px]'>{marker.text}</div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>

        </MapContainer>
    );
}

export default MapComponent

