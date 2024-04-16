import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, Popup, FeatureGroup, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
// import { EditControl } from "react-leaflet-draw"
import EditControl from '@/lib/EditControl';
import { DEFAULT_POSITION, MARKERS, CUSTOM_ICON } from '@/config/mapConfig';
import L from 'leaflet';

const MapComponent = ({ mode }) => {
    const [markers, setMarkers] = React.useState(MARKERS);
    const [lines, setLines] = React.useState([]);
    const [polygons, setPolygons] = React.useState([]);
    const editControlRef = useRef(null);

    useEffect(() => {
        switch (mode) {
            case 'point':
                console.log('point');
                startDrawing();
                break;
            default:
                break;
        }

    }, []);

    const startDrawing = () => {
        console.log('startDrawing');
        console.log(editControlRef);
        if (editControlRef.current) {
            editControlRef.current.handler.enable();
        }
    };


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

    const _onMounted = (drawControl) => {
        console.log('_onMounted', drawControl);
    };

    const _onCreated = (e) => {
        const type = e.layerType;
        const layer = e.layer;
        console.log('type', type);
        console.log('_onCreated', layer);
        console.log('_onCreated', layer._latlng.lat)
        console.log('_onCreated', layer._latlng.lng)


        switch (type) {
            case 'marker':
                console.log('_onCreated', layer._latlng.lat)
                console.log('_onCreated', layer._latlng.lng)
                setMarkers(prevMarkers => [...prevMarkers, { id: prevMarkers.length + 1, position: [layer._latlng.lat, layer._latlng.lng], text: 'New Marker' }]);
                break;
            case 'polyline':
                setLines(prevLines => [...prevLines, layer.getLatLngs()]);
                break;
            case 'polygon':
                setPolygons(prevPolygons => [...prevPolygons, layer.getLatLngs()]);
                break;
            default:
                break;
        }
    };


    const _onEdited = (e) => {
        console.log('_onEditStart', e);
    };

    const _onEditStart = (e) => {
        console.log('_onEditStart', e);
    };



    // let _editableFG = null;

    // const _onFeatureGroupReady = (reactFGref) => {
    //     // populate the leaflet FeatureGroup with the geoJson layers

    //     let leafletGeoJSON = new L.GeoJSON(getGeoJson());
    //     let leafletFG = reactFGref;

    //     leafletGeoJSON.eachLayer((layer) => {
    //         leafletFG.addLayer(layer);
    //     });

    //     // store the ref for future access to content

    //     _editableFG = reactFGref;
    // };


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
                <FeatureGroup
                // ref={(reactFGref) => {
                //     _onFeatureGroupReady(reactFGref);
                // }}
                >
                    <EditControl
                        ref={editControlRef}
                        position="bottomleft"
                        // onEdited={_onEdited}
                        onCreated={_onCreated}
                        // onDeleted={_onDeleted}
                        onMounted={_onMounted}
                        onEditStart={_onEditStart}
                        // onEditStop={_onEditStop}
                        // onDeleteStart={_onDeleteStart}
                        // onDeleteStop={_onDeleteStop}
                        draw={{
                            rectangle: false,
                            circle: false,
                            circlemarker: false,
                            marker: true,
                            polyline: true,
                            polygon: true,
                        }}
                    />
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


// data taken from the example in https://github.com/PaulLeCam/react-leaflet/issues/176
function getGeoJson() {
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [-122.47979164123535, 37.830124319877235],
                        [-122.47721672058105, 37.809377088502615],
                    ],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: [-122.46923446655273, 37.80293476836673],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: [-122.48399734497069, 37.83466623607849],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: [-122.47867584228514, 37.81893781173967],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [-122.48069286346434, 37.800637436707525],
                            [-122.48069286346434, 37.803104310307276],
                            [-122.47950196266174, 37.803104310307276],
                            [-122.47950196266174, 37.800637436707525],
                            [-122.48069286346434, 37.800637436707525],
                        ],
                    ],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [-122.48103886842728, 37.833075326166274],
                            [-122.48065531253813, 37.832558431940114],
                            [-122.4799284338951, 37.8322660885204],
                            [-122.47963070869446, 37.83231693093747],
                            [-122.47948586940764, 37.832467339549524],
                            [-122.47945636510849, 37.83273426112019],
                            [-122.47959315776825, 37.83289737938241],
                            [-122.48004108667372, 37.833109220743104],
                            [-122.48058557510376, 37.83328293020496],
                            [-122.48080283403395, 37.83332529830436],
                            [-122.48091548681259, 37.83322785163939],
                            [-122.48103886842728, 37.833075326166274],
                        ],
                    ],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [-122.48043537139893, 37.82564992009924],
                            [-122.48129367828368, 37.82629397920697],
                            [-122.48240947723389, 37.82544653184479],
                            [-122.48373985290527, 37.82632787689904],
                            [-122.48425483703613, 37.82680244295304],
                            [-122.48605728149415, 37.82639567223645],
                            [-122.4898338317871, 37.82663295542695],
                            [-122.4930953979492, 37.82415839321614],
                            [-122.49700069427489, 37.821887146654376],
                            [-122.4991464614868, 37.82171764783966],
                            [-122.49850273132326, 37.81798857543524],
                            [-122.50923156738281, 37.82090404811055],
                            [-122.51232147216798, 37.823344820392535],
                            [-122.50150680541992, 37.8271414168374],
                            [-122.48743057250977, 37.83093781796035],
                            [-122.48313903808594, 37.82822612280363],
                            [-122.48043537139893, 37.82564992009924],
                        ],
                    ],
                },
            },
        ],
    };
}

export default MapComponent

