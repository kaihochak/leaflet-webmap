import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Polygon, Popup, FeatureGroup } from 'react-leaflet';
// import EditControl from '@/lib/EditControl';
import { EditControl } from "react-leaflet-draw"
import { DEFAULT_POSITION, MARKERS, CUSTOM_ICON } from '@/config/mapConfig';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { z } from "zod"

// Schema for the text input form
const FormSchema = z.object({
    text: z.string().min(1, {
        message: "text must be at least 1 character.",
    }),
})

/************************************************************
 * Main Map Component
 ************************************************************/

const MapComponent = ({ textMode, features, setFeatures }) => {

    const [isOpen, setIsOpen] = React.useState(false);                  // text input modal
    const [selectedLayer, setSelectedLayer] = React.useState({});       // selected feature
    const [layerType, setLayerType] = React.useState('');               // type of feature

    /************************************************************
     * Function to check input
     ************************************************************/

    // useEffect(() => {
    //     console.log('layerType', layerType);
    // }, [layerType]);

    // useEffect(() => {
    //     console.log('selectedLayer', selectedLayer);
    // }, [selectedLayer]);

    useEffect(() => {
        console.log('features', features);
    }, [features]);

    /************************************************************
     * Function to add text to a feature
     ************************************************************/

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            text: "",
        },
    })

    const onSubmitText = (data) => {

        // get the newly created feature, add the text and update the state
        selectedLayer.bindPopup(data.text).openPopup();

        // add a text property to the selected feature
        setFeatures(prevFeatures => {
            let updatedFeatures = { ...prevFeatures };          // copy the previous state
            // map through the same type and update the text of the selected feature
            updatedFeatures[layerType] = updatedFeatures[layerType].map(feat =>
                feat._leaflet_id === selectedLayer._leaflet_id ? { ...feat, text: data.text } : feat
            );
            return updatedFeatures;
        });
        setIsOpen(false);
    }

    /************************************************************
     * Functions to handle react-leaflet-draw events
     ************************************************************/

    const _onDrawStart = (e) => {
        setLayerType(e.layerType);
    };

    const _onCreated = (e) => {
        console.log('_onCreated', e);
        const { layerType, layer } = e;
        layer.type = layerType;     // Store the type of layer
        setSelectedLayer(layer);    // Store the selected layer
        setIsOpen(true);

        // Updating state with the new feature
        setFeatures(prevFeatures => {
            const newFeature = { ...prevFeatures, [layerType]: [...prevFeatures[layerType], layer] };
            return newFeature;
        });
    };

    const _onEditStart = (e) => {
        console.log('_onEditStart', e);
    };

    const _onEdited = (e) => {
        const { layers } = e;
        let layerType = Object.values(layers._layers)[0].type;      // has to be a better way to get the layerType
        e.layers.eachLayer((layer) => {
            setFeatures(prevFeatures => {
                let updatedFeatures = { ...prevFeatures };
                // Update the appropriate feature array based on layerType
                updatedFeatures[layerType] = updatedFeatures[layerType].map(feat =>
                    feat.id === layer._leaflet_id ? { ...feat, ...layer.toGeoJSON() } : feat
                );
                return updatedFeatures;
            });
        });
        setIsOpen(true);
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
            </MapContainer>

            {/* Text Input Modal */}
            {textMode &&
                <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <Form {...form} >
                            <form onSubmit={form.handleSubmit(onSubmitText)} className="flex flex-col w-full gap-y-4">

                                <Label htmlFor="name">Description</Label>

                                <FormField
                                    control={form.control}
                                    name="text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Add your text" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit" className="bg-primary-dark">Save</Button>
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

