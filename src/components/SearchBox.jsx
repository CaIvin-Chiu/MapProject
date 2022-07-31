import {useState} from 'react'
import useOnclickOutside from 'react-cool-onclickoutside'
import usePlacesAutocomplate, {getGeocode, getLatLng} from 'use-places-autocomplete'

function SearchBox(props){
    

    // search Lat Lng will be use when "Search Location" button is clicked
    const [searchLat, setSearchLat] = useState(null)
    const [searchLng, setSearchLng] = useState(null)
    const [searchAddress, setSearchAddress] = useState(null)

    // value : current value type in the search box
    const {
        ready, 
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions}
        = usePlacesAutocomplate({
        requestOptions: {
            // prefer location, set Toronto's Coordinates as default, help prediction of the suggestions when searching
            location: { lat: () => 43.6532, lng: () => -79.3832},
            // prefer radius set to 200km = 200m * 1000
            radius: 200 * 1000
            }
        },
    )
    
    const ref = useOnclickOutside(() => {
        // When user clicks outside of the component, we can dismiss
        // the searched suggestions by calling this method
        clearSuggestions();
      });


    function handleSelect(address){
        // When user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(address.description, false)
        setSearchAddress(address.description)
        clearSuggestions();

        // Get latitude and longitude via utility functions
        getGeocode({address: address.description}).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            setSearchLat(lat)
            setSearchLng(lng)
        });
    }


    function handleClearInput(){
        setValue('', false)
        setSearchAddress(null)
    }
    
    return (
        <>
        <div ref={ref} className="search-bar">
            <input value={value} type="text" placeholder="Search Location Here" disabled={!ready}

            onChange={(e) => {
                setValue(e.target.value)
            }}

            onKeyPress={(e) => {
                if (e.key === 'Enter'){
                    // When an address from search list is selected
                    if (searchAddress){
                    props.searchLocation(searchLat, searchLng, searchAddress)
                    }
                }
            }}>
            </input>

            {/* Search Result List */}
            { status === 'OK' ?
            <ul>
                    {data.map((address) => 
                        <li key={address.place_id} onClick={() => handleSelect(address)}>{address.description}</li>
                    )}
            </ul> : null}

        </div>

        <button id="clear-button" onClick={handleClearInput}>x</button>
        <button onClick={ () => {
            // When an address from search list is selected
            if (searchAddress){
            props.searchLocation(searchLat, searchLng, searchAddress)
            }
        }
        }>
            Search Location
        </button>
    
        <button onClick={props.findCurrLocation}>Find Your Location</button>
        </>
    )
}

export default SearchBox;