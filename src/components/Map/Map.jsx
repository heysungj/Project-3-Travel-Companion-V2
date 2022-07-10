import { useState } from 'react'
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom'
import './Map.css'

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


export default function Map({ lat, lng, markers, checkIn, checkOut }) {
    // console.log(markers, lat, lng)
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_API_KEY,
    });
    if (!isLoaded) return <div>Loading...</div>
    else return <MapContainer
        lat={lat}
        lng={lng}
        markers={markers}
        checkIn={checkIn}
        checkOut={checkOut}
    />
}

function MapContainer({ lat, lng, markers, checkIn, checkOut }) {
    // console.log('markers:', markers)
    const center = { lat: lat, lng: lng }
    //useNavigate is a react-router-dom hook that is the only way I could figure out how to re-direct to show page
    const navigate = useNavigate()

    return (
        <GoogleMap
            zoom={12}
            center={center}
            mapContainerClassName="map-container"
        >
            {markers.map((marker, index) => {
                return <MarkerF
                    position={{ lat: marker.lat, lng: marker.lng }}
                    key={index}
                    label={marker.name}
                    onClick={() => navigate(
                        `/hotels/${marker.hotelId}?checkin=${checkIn}&checkout=${checkOut}&numberOfPerson=${marker.people}`,
                        {
                            state: {
                                markers: { marker },
                            }
                        }
                    )}
                />
            })
            }
        </GoogleMap>
    )
}