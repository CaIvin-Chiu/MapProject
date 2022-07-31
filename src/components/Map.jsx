import React from 'react'
import { GoogleMap, MarkerF} from '@react-google-maps/api'

function Map(props) {

    // Tornto's Coordinates
    const defaultLocation = { lat:43.6532, lng: -79.3832}
    const containerStyle = {
        width: '100%',
        height: '100%'
    }
    const defaultZoom = 10

    // if latitude and longtitude are not null
    const currPosition = {lat:props.lat, lng:props.lng}

    return(
        <div className="map">
                <GoogleMap center={props.lat && props.lng ? currPosition : defaultLocation} zoom={defaultZoom} mapContainerStyle={containerStyle} >
                    {props.records.map((record) => 
                        <MarkerF key={record.key} position={{lat: record.latitude, lng: record.longitude}} />)
                    }
                </GoogleMap>
        </div>
        )
}

export default Map;