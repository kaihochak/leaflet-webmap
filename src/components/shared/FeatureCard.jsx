import React, { useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { IoCopyOutline } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/coordAccordion"
import { ChevronDown } from "lucide-react"


const FeatureCard = ({ feature }) => {
    const [copied, setCopied] = React.useState(false)

    let geojsonFeature = feature.toGeoJSON();
    let type = geojsonFeature.geometry.type;
    let text = geojsonFeature.properties.text;
    console.log(geojsonFeature);


    // copied should only be true for 2 seconds
    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false)
            }, 1500)
        }
    }, [copied])


    const CopyButton = () => {

        const handleCopy = (event) => {
            event.preventDefault();
            event.stopPropagation();    // stop the click event from bubbling up to parent elements
            setCopied(!copied);
        };

        return (
            <Button onClick={handleCopy} variant="outline" size="icon" className={`${copied === true ? "bg-accent text-white" : ""}`}>
                <IoCopyOutline className={`h-[1.2rem] w-[1.2rem]  transition-all ${copied === true ? "-rotate-90 scale-0" : "rotate-0 scale-100"}`} />
                <IoMdCheckmark className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${copied === true ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
            </Button>
        )
    }

    const Coordinates = () => {
        return (
            <div className='flex'>
                {/* coordinates */}
                {type === "Point" &&
                    <div className="w-full flex-between gap-x-4">
                        <span>📍 {geojsonFeature.geometry.coordinates[0].toFixed(2)}, {geojsonFeature.geometry.coordinates[1].toFixed(2)}</span>
                        <CopyButton />
                    </div>
                }
                {type === "LineString" &&
                    <div className='w-full flex-between gap-x-4'>
                        <div className='flex flex-col gap-y-2'>
                            <span>📍 {geojsonFeature.geometry.coordinates[0][0].toFixed(2)}, {geojsonFeature.geometry.coordinates[0][1].toFixed(2)}</span>
                            <span>⛳️ {geojsonFeature.geometry.coordinates[1][0].toFixed(2)}, {geojsonFeature.geometry.coordinates[1][1].toFixed(2)}</span>
                        </div>
                        <CopyButton />
                    </div>
                }
                {type === "Polygon" &&
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <div className='flex-between'>
                                <AccordionTrigger className='flex items-center justify-start gap-x-2'>
                                    📍 {geojsonFeature.geometry.coordinates[0].length} points
                                    <ChevronDown className="w-4 h-4 transition-transform duration-200 shrink-0" />
                                </AccordionTrigger>
                                <div className='flex justify-end col-span-1'><CopyButton /></div>
                            </div>

                            <AccordionContent>
                                <div className='grid w-full grid-cols-5'>
                                    <ul className='col-span-4 gap-y-2'>
                                        {geojsonFeature.geometry.coordinates.map((line, index) => (
                                            line.map((point, index) => (
                                                <li key={index} className='grid grid-cols-4'>
                                                    <span className='col-start-1 col-end-3 font-bold text-left'>{index + 1} </span>
                                                    <span className='col-span-1 text-right'>{point[0].toFixed(2)}, </span>
                                                    <span className='col-span-1 text-right'>{point[1].toFixed(2)}</span>
                                                </li>
                                            ))
                                        ))}
                                    </ul>

                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                }

            </div>
        )
    }

    /*********************************************************************************************
     * Rendering
     *******************************************************************************************/

    return (
        <div className='py-2 flex-between gap-x-4'>
            <Card className="w-[350px]">
                <CardHeader>
                    {/* Feature # & Feauter type */}
                    <CardDescription className="pb-4 flex-between gap-x-8">
                        <>Feature #{feature._leaflet_id}</>
                        {type === "Point" && <Badge className="bg-secondary">Point</Badge>}
                        {type === "LineString" && <Badge className="bg-accent">Line</Badge>}
                        {type === "Polygon" && <Badge className="bg-primary">Area</Badge>}
                    </CardDescription>
                    {/* Feature text */}
                    <CardTitle >
                        <div className="grid items-center w-full gap-4">
                            {text ?
                                <Label htmlFor="text" className="py-3">{text}</Label> :
                                <div className="relative flex-between space-y-1.5">
                                    <Input id="text" placeholder="Add a text" className="pr-8" />
                                    <Button asChild className="absolute right-0 w-5 h-5 m-2 bottom-2.5" variant="ghost" size="icon"><MdOutlineKeyboardArrowRight /></Button>
                                </div>
                            }
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Feature coordinates */}
                    <Coordinates />
                </CardContent>
            </Card>
        </div>
    )
}

export default FeatureCard