import React, { useCallback, useEffect } from 'react'
import { BiMenuAltRight } from "react-icons/bi";
import { Input } from "@/components/ui/input"
import { IoCloseSharp } from "react-icons/io5";
import debounce from "lodash.debounce";
import FeatureCard from '@/components/shared/FeatureCard'


/********************************************************************************
 * 
 * The shape of the features object is as follows:
 * 
 * {
 *     marker: [marker1, marker2, ...],
 *     polyline: [polyline1, polyline2, ...],
 *     polygon: [polygon1, polygon2, ...]
 * }
 * 
 * After flattening the object, the features array will look like this:
 * 
 *      [marker1, marker2, polyline1, polyline2, polygon1, polygon2, ...]
 * 
 * Each feature object has the following essentail fields:
 * 
 * {
 *    _leaflet_id: 1,
 *    type: 'marker',
 *    text: 'This is a marker',
 *    _latlng: {lat: 0, lng: 0}
 * }
 * 
 * {
 *    _leaflet_id: 2,
 *    type: 'polyline',
 *    text: 'This is a polyline',
 *    _latlngs: [{lat: 0, lng: 0}, {lat: 1, lng: 1}]
 * }
 * 
 * {
 *    _leaflet_id: 3,
 *    type: 'polygon',
 *    text: 'This is a polygon',
 *    _latlngs: [[{lat: 0, lng: 0}, {lat: 1, lng: 1}, {lat: 2, lng: 2}]]
 * }
 * 
 *********************************************************************************/

const SearchSidebar = ({ features: parentFeatures, sidebarOpen, setSidebarOpen }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [features, setFeatures] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    // convert parentFeatures to features by flatening the object
    useEffect(() => {
        setFeatures(Object.values(parentFeatures).flat());
    }, [parentFeatures]);

    /************************************************************
     * Functions for searching
     ************************************************************/

    // Function to handle search input changes, with debouncing
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
        if (!searchTerm) return features;       // Return all features if no search term
        
        return featureList = features.filter((feature) => {
            return feature.text?.toLowerCase().includes(searchTerm);
        });
    };

    // Search Results for each feature
    const SearchResults = () => {
        const featureList = filteredFeatures();
        return (
            <div className='flex-col gap-y-4'>
                {featureList.length === 0 ?
                    <p>No results found</p> :
                    featureList?.map((feature, index) => <FeatureCard key={index} feature={feature} />)
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
