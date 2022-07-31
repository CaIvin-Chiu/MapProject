import './App.css';
import './styles/base.css'
import './styles/SearchBox.css'
import './styles/Map.css'
import './styles/SearchRecord.css'
import {useLoadScript} from '@react-google-maps/api'
import React , {useState} from 'react'
import SearchBox from './components/SearchBox'
import Map from './components/Map'
import SearchRecord from './components/SearchRecord'

// Timezone API
const axios = require('axios');

// initial search record list
const initRecords = []

// initial id
let recordId = 0

// libraries for google map api script

const libraries = ['places']

function App() {

    const {isLoaded} = useLoadScript(
      {
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        libraries: libraries
      }
    )

    // initial marker position
    const [lat , setLat] = useState(null)
    const [lng , setLng] = useState(null)


    // All records in list of objects, use for marker on the map and display records
    const [records , setRecords] = useState(initRecords)

    // selected records, for now only delete feature is available for selected records
    const [selected, setSelected] = useState([])

    function searchLocation(lat,lng, address){
        setLat(lat)
        setLng(lng)


        // current UTC timestamp in seconds
        const currUTCTimeStamp = Math.round(new Date().getTime()/1000);
        
        // get searched timezone and local time with timezone API
        const config = {
          method: 'get',
          url: `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${currUTCTimeStamp}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`,
          headers: { }
        };

        // append new record
        const addRecord = (localTime, timeZone ) => {
          const newRecord = {
            id: recordId,
            key: recordId,
            address: address,
            latitude: lat, 
            longitude: lng,
            time: localTime,
            timeZone: timeZone
          }
          setRecords((prevRecords) => [newRecord, ...prevRecords])
        }

        // get Time with Timezone API
        axios(config)
        .then((response)  => {
          // Local time of the serached location
          const currLocalTimeStamp = response.data.rawOffset +  response.data.dstOffset + currUTCTimeStamp
          const currLocalTime = new Date(Math.round(currLocalTimeStamp * 1000)).toUTCString()
          const currTimeZone = response.data.timeZoneName
          addRecord(currLocalTime, currTimeZone);
        })
        .catch(function (error) {
          console.log(error);
        });

        recordId += 1
    }

    // Find User's current location on
    function findCurrLocation() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (currPosition) => {
              searchLocation(currPosition.coords.latitude, currPosition.coords.longitude, "Your Location")
            });
      }
    }

    function handleSelected(recordID){

        // if recordID is not selected in the list, append this ID to selected list
        if (!selected.includes(recordID)){
            setSelected((prevSelected) => [...prevSelected, recordID] ) 
        }
        // recordID already in the list, remove it from selected list
        else{
            setSelected(selected.filter((ID) => ID !== recordID ))
        }
      }


    // delete list of selected record
    function handleDelete(deleteList){
      // delete selected record
      setRecords((prevRecords) => prevRecords.filter((prevRecord) => !deleteList.includes(prevRecord.id)))
      // clear selected
      setSelected([])
    }

    return (
      (isLoaded) ?
      <div className="App">

        <div className="search-box">
          <SearchBox findCurrLocation={findCurrLocation} searchLocation={searchLocation} />
        </div>

        <div className="container">
          <Map lat={lat} lng={lng} records={records}/>
          <SearchRecord records={records} selected={selected} setSelected={setSelected} handleSelected={handleSelected} handleDelete={handleDelete}/>
        </div>

      </div>
    : null
    )
  }

export default App;
