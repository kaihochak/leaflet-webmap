import React, { useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { IoCopyOutline } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/coordAccordion"
import { ChevronDown } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Schema for the text input form
const FormSchema = z.object({
    text: z.string().min(1, {
        message: "text must be at least 1 character.",
    }),
})

const FeatureCard = ({ feature, setEditDetails }) => {
    const [copied, setCopied] = React.useState(false)
    const [editing, setEditing] = React.useState(false)
    let geojsonFeature = feature.toGeoJSON();
    let type = geojsonFeature.geometry.type;
    let text = geojsonFeature.properties.text;

    // copied should only be true for 2 seconds
    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false)
            }, 1500)
        }
    }, [copied])

    const CopyButton = () => {
        return (
            <Button onClick={() => setCopied(!copied)} variant="outline" size="icon" className={`${copied === true ? "bg-accent text-white" : ""}`}>
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

    /************************************************************
     * Function for text
     ************************************************************/
    const form = useForm({
        resolver: zodResolver(FormSchema),
        // either use the feature text or an empty string
        defaultValues: {
            text: text,
        },
    })

    const onSubmitText = (data) => {
        setEditDetails({ id: feature._leaflet_id, newText: data.text });
        form.reset();
    }

    /*********************************************************************************************
     * Rendering
     *******************************************************************************************/

    return (
        <div className='py-2 flex-between gap-x-4'>
            <Card className="w-[350px]">
                <CardHeader>
                    {/* Feature # & Feauter type */}
                    <CardDescription className="pb-2 flex-between gap-x-8">
                        <>Feature #{feature._leaflet_id}</>
                        {type === "Point" && <Badge className="bg-secondary">Point</Badge>}
                        {type === "LineString" && <Badge className="bg-accent">Line</Badge>}
                        {type === "Polygon" && <Badge className="bg-primary">Area</Badge>}
                    </CardDescription>
                    {/* Feature text */}
                    <CardTitle >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmitText)} >
                                <div className="flex items-start justify-between gap-x-4">
                                    {!editing && text ?
                                        <Label htmlFor="text" className="py-1">
                                            {text.split('<br>').map((line, index) =>
                                                <p key={index}>{line || <br />}</p>
                                            )}
                                        </Label> :
                                        <FormField
                                            control={form.control}
                                            name="text"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea className="min-h-[30px] w-full" placeholder="Add text" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }
                                    <Button onClick={() => setEditing(!editing)} variant="outline" size="icon" className={`${copied === true ? "bg-accent text-white" : ""}`}>
                                        <FaRegEdit className={`h-[1.2rem] w-[1.2rem]  transition-all ${editing === true ? "-rotate-90 scale-0" : "rotate-0 scale-100"}`} />
                                        <MdOutlineKeyboardArrowRight className={`absolute h-[1.7rem] w-[1.7rem] transition-all ${editing === true ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
                                    </Button>
                                </div>
                            </form>
                        </Form>
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