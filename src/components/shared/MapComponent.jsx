import React, { useEffect } from 'react'
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
// import EditControl from '@/lib/EditControl';
import { EditControl } from "react-leaflet-draw"
import 'leaflet/dist/leaflet.css';
import { DEFAULT_POSITION } from '@/config/mapConfig';
import TextInput from '@/components/shared/TextInput'

/************************************************************
 * Main Map Component
 ************************************************************/

const MapComponent = ({ textMode, editDetails, features, setFeatures }) => {

    const [isOpen, setIsOpen] = React.useState(false);                  // text input modal
    const [selectedLayer, setSelectedLayer] = React.useState({});       // selected feature
    L.Icon.Default.imagePath = '/images/';

    // bind the text to the selected feature, then push it to the properties field so we could use toGeoJSON() to get the feature
    const onSubmitText = (data) => {
        let popupContent = getPopupContent(data.text);

        if (!selectedLayer) return;
        selectedLayer.bindPopup(popupContent).openPopup();      // get the selected feature, add the text and update the state
        setFeatures(prevFeatures => {                           // find the feature that has the same _leaflet_id as the selectedLayer
            let updatedFeatures = prevFeatures.map(feat => {
                // add or update the text property
                if (feat._leaflet_id === selectedLayer._leaflet_id) {
                    if (!feat.feature) feat.feature = { type: 'Feature', properties: { text: popupContent } };
                    else feat.feature.properties.text = popupContent;
                }
                return feat;
            });
            return updatedFeatures;
        });
        setSelectedLayer({});                                   // clear the selected layer
        setIsOpen(false);
    }

    const getPopupContent = (text) => { 
        if (!text) return '';
        let popupContent = '';                                  // extract lines
        let lastLine = text.split('\n').pop();                  // add line breaks if not the last line
        for (let line of text.split('\n')) {
            popupContent += `${line}` + (line !== lastLine ? '<br>' : '');
        }
        return popupContent;
    }

    /************************************************************
     * Function to edit text without triggering leaflet-draw
     ************************************************************/

    useEffect(() => {
        onEdit(editDetails);
    }, [editDetails]);

    const onEdit = (editDetails) => {
        const { id, newText } = editDetails;
        let popupContent = getPopupContent(newText);

        setFeatures(prevFeatures => {
            let updatedFeatures = prevFeatures.map(feat => {
                if (feat._leaflet_id === id) {
                    if (!feat.feature) {
                        feat.feature = { type: 'Feature', properties: { text: newText } };
                    }
                    else feat.feature.properties.text = newText;
                    // update the popup
                    feat.bindPopup(popupContent).openPopup();
                }
                return feat;
            });
            return updatedFeatures;
        });
        setIsOpen(false);
    }

    /************************************************************
     * Functions to handle react-leaflet-draw events
     ************************************************************/
    const _onCreated = (e) => {
        const { layer } = e;
        setSelectedLayer(layer);            // Store the selected layer
        setIsOpen(true);
        setFeatures(prevFeatures => [...prevFeatures, layer]);
    };

    const _onEdited = (e) => {
        const { layers } = e;

        layers.eachLayer((layer) => {
            setSelectedLayer(layer); // Store the selected layer
            setFeatures(prevFeatures => prevFeatures.map(feat =>
                feat._leaflet_id === layer._leaflet_id ? layer : feat
            ));
        });
        setIsOpen(true);
    };

    const _onDeleted = (e) => {
        const { layers } = e;
        layers.eachLayer((layer) => {
            setFeatures(prevFeatures => prevFeatures.filter(feat => feat._leaflet_id !== layer._leaflet_id));
        });
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

                {/* Draw Control & Features */}
                <FeatureGroup>
                    <EditControl
                        textMode={textMode}
                        position="bottomleft"
                        onEdited={_onEdited}
                        onCreated={_onCreated}
                        onDeleted={_onDeleted}
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
            </MapContainer>

            <TextInput 
                textMode={textMode} 
                featureText={selectedLayer.feature?.properties?.text}
                onSubmitText={onSubmitText}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </section>
    );
}

export default MapComponent

