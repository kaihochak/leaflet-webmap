import React from 'react'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const EditMode = ({ textMode, setTextMode }) => {

    return (
        <section id="edit-panel" >
            <div className="flex items-center space-x-2">
                <Switch id="text-mode" className="data-[state=checked]:bg-primary-dark"
                 checked={textMode} onCheckedChange={() => setTextMode(!textMode)} />
                <Label htmlFor="text-mode">Text Mode</Label>
            </div>
        </section>
    )
}

export default EditMode
