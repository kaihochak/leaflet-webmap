import React, { useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { IoCopyOutline } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

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

    return (
        <div className='py-2 flex-between gap-x-4'>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardDescription className="pb-4 flex-between gap-x-8">
                        <>Feature #{feature._leaflet_id}</>
                        { type === "Point" && <Badge className="bg-secondary">Point</Badge>}
                        { type === "LineString" && <Badge className="bg-accent">Line</Badge>}
                        { type === "Polygon" && <Badge className="bg-primary">Polygon</Badge>}
                    </CardDescription>
                    <CardTitle >
                        <div className="grid items-center w-full gap-4">
                            {text ?
                                <Label htmlFor="text" className="py-3">{text}</Label> :
                                <div className="relative flex-between space-y-1.5">
                                    <Input id="text" placeholder="Add a text" className="pr-8"/>
                                    <Button asChild className="absolute right-0 w-5 h-5 m-2 bottom-2.5" variant="ghost" size="icon"><MdOutlineKeyboardArrowRight/></Button>
                                </div>
                            }
                        </div>
                    </CardTitle>

                </CardHeader>
                <CardContent>
                    <div className="flex-between">
                        {/* <div className='flex gap-x-4'>📍 {lat.toString().substring(0, 12)}, {lng.toString().substring(0, 12)}</div> */}
                        <Button variant="outline" size="icon" onClick={() => setCopied(!copied)} className={`${copied === true ? "bg-accent" : ""}`}>
                            <IoCopyOutline className={`h-[1.2rem] w-[1.2rem]  transition-all ${copied === true ? "-rotate-90 scale-0" : "rotate-0 scale-100"}`} />
                            <IoMdCheckmark className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${copied === true ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}

export default FeatureCard