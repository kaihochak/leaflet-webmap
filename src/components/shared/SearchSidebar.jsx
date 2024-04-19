import React, { useCallback, useEffect, useRef } from 'react'
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
    const [allFeatures, setAllFeatures] = React.useState([]);
    const [searchResults, setSearchResults] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const searchTermRef = useRef(searchTerm);  // Ref to store the current search term
    searchTermRef.current = searchTerm;  // Update ref whenever searchTerm changes

    
    // Ref to track the current features for debounced function
    const allFeaturesRef = useRef(allFeatures);

    
    // convert parentFeatures to features by flatening the object
    useEffect(() => {
        const flatFeatures = Object.values(parentFeatures).flat();
        console.log('Flat features:', flatFeatures);
        setAllFeatures(flatFeatures);
        setSearchResults(flatFeatures); // Initialize searchResults with all features
        allFeaturesRef.current = flatFeatures; // Update ref
    }, [parentFeatures]);


    useEffect(() => {
        console.log('allFeatures:', allFeatures);
    }, [allFeatures]);


    /************************************************************
     * Functions for searching
     ************************************************************/

    // Debounced search function to delay processing of search input
    //  for possible implementation of API call / complex search in the future
    const requestSearch = (searchTerm) => {
        console.log('Searching for:', searchTerm.trim());
        setLoading(true);
        // filtering features based on search term
        if (searchTerm.trim()) {
            const filtered = filteredFeatures();
            setSearchResults(filtered);
        } else {
            console.log('Search term is empty');
            console.log('Resetting to original list', allFeatures);
            // Reset to the original list when the search term is cleared
            setSearchResults(allFeatures);
        }
        setLoading(false);
    };

    const debouncedSearch = useCallback(debounce((searchTerm) => {
        requestSearch(searchTerm);
    }, 300), [requestSearch]);

    // Filter features based on search term
    const filteredFeatures = () => {
        console.log('Filtering features based on search term:', searchTerm);
        if (!searchTerm) return allFeatures;       // Return all features if no search term
        return allFeatures.filter((feature) => {

            let test = feature.text.toLowerCase().includes(searchTerm.toLowerCase());
            console.log('Feature:', feature.text, 'Test:', test, 'Search Term:', searchTerm);

            return test;
        });
    };

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
                    searchResults.map((feature, index) => <FeatureCard key={index} feature={feature} />)
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
