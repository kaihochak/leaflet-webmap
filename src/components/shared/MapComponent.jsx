import React, { useEffect } from 'react'
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
// import EditControl from '@/lib/EditControl';
import { EditControl } from "react-leaflet-draw"
import 'leaflet/dist/leaflet.css';
import { DEFAULT_POSITION } from '@/config/mapConfig';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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

const MapComponent = ({ textMode, editDetails, features, setFeatures }) => {

    const [isOpen, setIsOpen] = React.useState(false);                  // text input modal
    const [selectedLayer, setSelectedLayer] = React.useState({});       // selected feature

    L.Icon.Default.imagePath = '/images/';

    /************************************************************
     * Function to add text to a feature
     ************************************************************/
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            text: "",
        },
    })

    // bind the text to the selected feature, then push it to the properties field so we could use toGeoJSON() to get the feature
    const onSubmitText = (data) => {
        let popupContent = getPopupContent(data.text);

        if (!selectedLayer) return;

        console.log('selectedLayer', selectedLayer);
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
        console.log('_onCreated', e);
        const { layer } = e;
        setSelectedLayer(layer);            // Store the selected layer
        setIsOpen(true);
        setFeatures(prevFeatures => [...prevFeatures, layer]);
    };

    const _onEdited = (e) => {
        const { layers } = e;
        layers.eachLayer((layer) => {
            setSelectedLayer(layer);            // Store the selected layer
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
                                                <Textarea placeholder="Add text" {...field} />
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

