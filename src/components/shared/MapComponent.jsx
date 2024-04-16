import React, { useEffect } from 'react'
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, Popup, FeatureGroup, Circle} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { EditControl } from "react-leaflet-draw"
import { DEFAULT_POSITION, MARKERS, CUSTOM_ICON } from '@/config/mapConfig';

const MapComponent = ({ mode }) => {
    const [markers, setMarkers] = React.useState(MARKERS);
    const [lines, setLines] = React.useState([]);
    const [polygons, setPolygons] = React.useState([]);

    useEffect(() => {
        console.log('polygons:', polygons);
    }, [polygons]);

    

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
     * This function is a custom hook that adds a feature to the map
     *  It could be a point, line, or area
     ************************************************************/

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const newPoint = [e.latlng.lat, e.latlng.lng];
                switch (mode) {
                    case 'point':
                        const newMarker = { id: markers.length + 1, position: newPoint, text: 'New Marker' };
                        setMarkers([...markers, newMarker]);
                        break;
                    case 'line':
                        if (lines.length === 0) {
                            setLines([[newPoint]]);
                        } else {
                            const newLines = [...lines];
                            newLines[newLines.length - 1].push(newPoint);
                            setLines(newLines);
                        }
                        break;
                    case 'area':
                        if (polygons.length === 0) {
                            setPolygons([[newPoint]]);
                        } else {
                            const newPolygons = [...polygons];
                            newPolygons[newPolygons.length - 1].push(newPoint);
                            setPolygons(newPolygons);
                        }
                        break;
                    default:
                        break;
                }
            },
        });
        return null;
    };

    /************************************************************
     * RENDERING
     ************************************************************/

    return (
        <section id="map-container">
            <MapContainer
                center={DEFAULT_POSITION}
                zoom={8}
                style={{ height: '100vh', width: '100%' }}
            >
                {/* Open Street Map */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                        OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />

                {/* Draw Control */}
                <FeatureGroup>
                    <EditControl position="bottomleft" draw={{
                        rectangle: true,
                        circle: true,
                        circlemarker: false,
                        marker: true,
                        polyline: true,
                        polygon: true,
                    }} />
                </FeatureGroup>

                {/* LocationMarker: it adds a marker to the map */}
                {/* <LocationMarker /> */}

                <Circle center={[50.5, 30.5]} radius={200} pane="overlayPane" />

                {/* MarkerClusterGroup: it groups markers into clusters */}
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={CreateClusterCustomIcon}
                >
                    {/* display markers on the map */}
                    {markers.map(marker => (
                        <Marker key={marker.id} position={marker.position} icon={CUSTOM_ICON}>
                            <Popup>
                                <div className='text-[36px]'>{marker.text}</div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>

                {/* display lines on the map */}
                {lines.map((line, index) => (
                    <Polyline key={index} positions={line} color="red" />
                ))}

                {/* display areas on the map */}
                {polygons.map((polygon, index) => (
                    <Polygon key={index} positions={polygon} color="blue" fillOpacity={0.5} />
                ))}

            </MapContainer>
        </section>
    );
}

export default MapComponent

