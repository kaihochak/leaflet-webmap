import React, { useEffect } from 'react'
import 'leaflet/dist/leaflet.css';
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

const TextInput = ({textMode, textInput, onSubmitText, isOpen, setIsOpen}) => {

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            text: "",
        },
    })

    // make sure the text input is exactly the text of the feature we are editing
    useEffect(() => {
        form.setValue('text', textInput)
    }, [textInput])

    return (
        <div>
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
        </div>
    )
}

export default TextInput
