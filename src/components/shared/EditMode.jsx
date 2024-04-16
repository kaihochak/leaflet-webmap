import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const EditMode = ({mode, setMode}) => {
    
    return (
        <section id="edit-panel" >
            <Tabs defaultValue={mode} className="w-[300px]" onValueChange={(mode) => setMode(mode)}>
                {/* <TabsContent value="point">Make changes to your account here.</TabsContent>
                <TabsContent value="line">Change your password here.</TabsContent>
                <TabsContent value="area">Change your password here.</TabsContent> */}
                <TabsList className="grid w-full grid-cols-3 bg-primary/90 text-primary-foreground">
                    <TabsTrigger value="point">📍 Point</TabsTrigger>
                    <TabsTrigger value="line">✏️ Line</TabsTrigger>
                    <TabsTrigger value="area">🗺️ Area</TabsTrigger>
                </TabsList>
            </Tabs>
        </section>
    )
}

export default EditMode
