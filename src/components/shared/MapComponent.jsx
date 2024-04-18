import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, FeatureGroup } from 'react-leaflet';
import EditControl from '@/lib/EditControl';
import { DEFAULT_POSITION, MARKERS, CUSTOM_ICON } from '@/config/mapConfig';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Schema for the text input form
const FormSchema = z.object({
    text: z.string().min(2, {
        message: "text must be at least 2 characters.",
    }),
})

/************************************************************
 * Main Map Component
 ************************************************************/

const MapComponent = ({ textMode }) => {

    const [isOpen, setIsOpen] = React.useState(false);
    const [layerType, setLayerType] = React.useState('');
    const [markers, setMarkers] = React.useState([]);
    const [lines, setLines] = React.useState([]);
    const [polygons, setPolygons] = React.useState([]);
    const [textLocation, setTextLocation] = React.useState([]);
    const [textElements, setTextElements] = React.useState({
        markers: MARKERS,
        lines: [],
        polygons: [],
    });

    /************************************************************
     * Function to check input
     ************************************************************/

    useEffect(() => {
        console.log('layerType', layerType);
    }, [layerType]);

    useEffect(() => {
        console.log('textElements', textElements);
    }, [textElements]);

    useEffect(() => {
        console.log('markers', markers);
    }, [markers]);

    /************************************************************
     * Function to add text to a feature
     ************************************************************/

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            text: "",
        },
    })

    const onSubmit = (data) => {

        // get the newly created feature, add the text and update the state
        switch (layerType) {
            case 'marker':
                let newFeature = markers[markers.length - 1];
                newFeature.text = data.text;
                setMarkers([...markers.slice(0, markers.length - 1), newFeature]);
                break;
            case 'polyline':
                let newLine = lines[lines.length - 1];
                newLine.text = data.text;
                setLines([...lines.slice(0, lines.length - 1), newLine]);
                break;
            case 'polygon':
                let newPolygon = polygons[polygons.length - 1];
                newPolygon.text = data.text;
                setPolygons([...polygons.slice(0, polygons.length - 1), newPolygon]);
                break;
            default:
                break;
        }
        setIsOpen(false);
    }

    /************************************************************
     * Functions to handle react-leaflet-draw events
     ************************************************************/

    const _onDrawStart = (e) => {
        setLayerType(e.layerType);
    };

    const _onCreated = (e) => {
        const type = e.layerType;
        const layer = e.layer;

        let newFeature;
        switch (type) {
            case 'marker':
                newFeature = { id: markers.length + 1, position: layer._latlng };
                setMarkers(prevMarkers => [...prevMarkers, newFeature]);
                setTextLocation(newFeature.position);
                break;
            case 'polyline':
                newFeature = { id: lines.length + 1, position: layer._latlngs };
                setLines(prevLines => [...prevLines, newFeature]);
                setTextLocation(newFeature.position);
                break;
            case 'polygon':
                console.log('_onCreated', layer._latlngs)
                newFeature = { id: polygons.length + 1, position: layer._latlngs };
                setPolygons(prevPolygons => [...prevPolygons, newFeature]);
                break;
            default:
                break;
        }
        setIsOpen(true);
    };

    const _onEditStart = (e) => {
        console.log('_onEditStart', e);
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
                        // onEdited={_onEdited}
                        onDrawStart={_onDrawStart}
                        onCreated={_onCreated}
                        // onDeleted={_onDeleted}
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
                
                {/* Text Popup for points*/}
                {markers.map((marker, index) => (
                    <Marker key={index} position={marker.position}>
                        <Popup>
                            {marker.text}
                        </Popup>
                    </Marker>
                ))}


                {/* Text Popup for lines */}
                {lines.map((line, index) => (
                    <Polyline key={index} positions={line.position}>
                        <Popup>
                            {line.text}
                        </Popup>
                    </Polyline>
                ))}

                {/* Text Popup for polygons */}
                {polygons.map((polygon, index) => (
                    <Polyline key={index} positions={polygon.position}>
                        <Popup>
                            {polygon.text}
                        </Popup>
                    </Polyline>
                ))}

            </MapContainer>

            {/* Text Input Modal */}
            {textMode &&
                <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <Form {...form} >
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="add your text" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Save</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            }
        </section>
    );
}

export default MapComponent

