import React, { useCallback, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { IoCloseSharp } from "react-icons/io5";
import debounce from "lodash.debounce";
import FeatureCard from '@/components/shared/FeatureCard'

const SearchSidebar = ({ features: parentFeatures, setEditDetails, sidebarOpen, setSidebarOpen }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [allFeatures, setAllFeatures] = React.useState([]);
    const [searchResults, setSearchResults] = React.useState([]);

    // convert parentFeatures to features by flatening the object
    useEffect(() => {
        const flatFeatures = Object.values(parentFeatures).flat();
        setAllFeatures(flatFeatures);
        setSearchResults(flatFeatures); // Initialize searchResults with all features
    }, [parentFeatures]);

    /************************************************************
     * Functions for searching
     ************************************************************/

    // Debounced search function to delay processing of search input
    //  for possible implementation of API call / complex search in the future
    const requestSearch = (searchTerm) => {
        // If search term is empty, reset search results to all features
        if (!searchTerm.trim()) setSearchResults(allFeatures);
        // Otherwise, filter features based on search term
        else {
            const filtered = allFeatures.filter(feature => {
                let geojsonFeature = feature.toGeoJSON();
                if (!geojsonFeature.properties.text) return false;
                else return feature.toGeoJSON().properties.text.toLowerCase().includes(searchTerm.toLowerCase());
            }
            );
            setSearchResults(filtered);
        }
    };

    const debouncedSearch = useCallback(debounce((searchTerm) => {
        requestSearch(searchTerm);
    }, 300), [requestSearch]);

    // Function to handle search input changes, with debouncing
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
        debouncedSearch(event.target.value.toLowerCase());
    };

    /************************************************************
     * Search Results
     ************************************************************/

    const SearchResults = () => {
        return (
            <div className='flex-col gap-y-4'>
                {searchResults.length === 0 ?
                    <p>No features found</p> :
                    searchResults.map((feature, index) =>
                        <FeatureCard key={index} feature={feature} setEditDetails={setEditDetails} searchTerm={searchTerm}/>
                    )
                }
            </div>
        );
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
