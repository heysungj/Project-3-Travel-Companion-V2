import fetchApi from "../../utilities/fetchApi";
import './HotelListPage.css'
import HotelListCard from "../../components/HotelListCard/HotelListCard";
import Map from "../../components/Map/Map";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


export default function HotelsListPage() {
  const { state } = useLocation();
  // console.log(state);
  const { searchResult, checkIn, checkOut, coordinates, numberOfPerson } =
    state;
  const [markers, setMarkers] = useState([]);
  console.log(searchResult)
  useEffect(() => {

    (() => {
      const people = numberOfPerson;
      // console.log(searchResult)
      //When page renders, create an array of all of the lat/lon for each hotel
      //Then set the state of markers to that new array. Also passing hotel_id to redirect when clicking marker
      const filteredMarkers = searchResult.map((hotel) => {
        return {
          name: hotel.hotel_name,
          hotelId: hotel.hotel_id,
          lat: hotel.latitude,
          lng: hotel.longitude,
          people: people,
        };
      });
      setMarkers(filteredMarkers);
    })();
  }, []);

  return (
    <div className="listPage-container">
      <h1>Available Hotels at {searchResult[0].city}</h1>
      <h3>For {checkIn} to {checkOut}</h3>
      <div className="listPageMainContainer">
         <div className="listPage-map">
         <Map
            // The lat and lng are passed to map to render map centered on city that was searched for
            lat={coordinates.lat}
            lng={coordinates.lng}
            markers={markers}
            checkIn={checkIn}
            checkOut={checkOut}
            numberOfPerson={numberOfPerson}
          />
         </div>
          
          {searchResult.map((hotel) => {
            const filterMarker = (marker) => {
              return marker.name === hotel.hotel_name;
            };
            const marker = markers.filter(filterMarker);
            return (
              <HotelListCard
                // lat={coordinates.lat}
                // lng={coordinates.lng}
                hotel={hotel}
                key={hotel.hotel_id}
                checkIn={checkIn}
                checkOut={checkOut}
                marker={marker[0]}
                numberOfPerson={numberOfPerson}
              />
            );
          })}
      </div>
    </div>
  );
}
