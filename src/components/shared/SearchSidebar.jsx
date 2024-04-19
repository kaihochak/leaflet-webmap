import React, { useCallback, useEffect } from 'react'
import { BiMenuAltRight } from "react-icons/bi";
import { Input } from "@/components/ui/input"
import { IoCloseSharp } from "react-icons/io5";
import debounce from "lodash.debounce";
import FeatureCard from '@/components/shared/FeatureCard'

const SearchSidebar = ({ features: parentFeatures }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(true)
    const [searchTerm, setSearchTerm] = React.useState('');
    const [features, setFeatures] = React.useState(parentFeatures);
    const [loading, setLoading] = React.useState(false);

    // Update features when parentFeatures change
    useEffect(() => {
        console.log("parentFeatures", parentFeatures);
        console.log("Object.values(parentFeatures).flat()", Object.values(parentFeatures).flat());
        setFeatures(parentFeatures);
    }, [parentFeatures]);

    // Function to handle search input changes
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
        debouncedSearch(event.target.value.toLowerCase());
    };
    const debouncedSearch = useCallback(
        (searchTerm) => requestSearch(searchTerm), []
    );
    const requestSearch = debounce((searchTerm) => {
        console.log(searchTerm);
        if (searchTerm && searchTerm.length > 0) {
            setLoading(true);
            // Call API to search features
        }
        setLoading(false);
    });

    // Filter features based on search term
    const filteredFeatures = () => {
        if (!searchTerm) return features;
        return features.filter((feature) => {
            // Assuming 'feature.text' or any other relevant property to match against
            return feature.text.toLowerCase().includes(searchTerm);
        });
    };

    // Search Results for each feature
    const SearchResults = () => {
        return (
            <div className='flex-col gap-y-4 '>
                {Object.values(features).flat().length === 0 ?
                    <p>No results found</p>
                    : Object.values(features).flat().map((feature, index) => <FeatureCard key={index} feature={feature} />)
                }
            </div>
        )
    }

    /************************************************************
     * Rendering
     ************************************************************/

    return (
        <div className='relative flex-col flex-center gap-y-4'>
            {/* Search bar */}
            <div className='sticky w-full pt-2 pb-6 pl-8 pr-4 top-4 flex-between gap-x-3'>
                <Input
                    id="name"
                    placeholder="Search"
                    className="h-12 w-[350px] border-2"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                {/* Close */}
                <button className="text-primary-dark text-[23px] " onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <IoCloseSharp />
                </button>
            </div>

            {/* Search Results */}
            <SearchResults />
        </div>
    )
}

export default SearchSidebar
