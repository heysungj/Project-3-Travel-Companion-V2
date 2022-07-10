import { useState, useEffect } from "react";
import {
  markPlacesArr,
  jingPlacesArr,
  tirasPlacesArr,
} from "./ourFavoritePlacesData";
import "./FavoritePlaces.css";
const axios = require("axios");
const API_KEY = process.env.REACT_APP_BOOKING_API_KEY;

// Using dates one month in the future for checkin / checkout because some destinations were sold out of hotels today
let checkIn = new Date(new Date().setMonth(new Date().getMonth() + 1));
let checkOut = new Date(new Date().setMonth(new Date().getMonth() + 1));
checkOut.setDate(checkIn.getDate() + 1);
// This makes the format 'yyyy-mm-dd' for the axios fetch
checkIn = checkIn.toISOString().slice(0, 10);
checkOut = checkOut.toISOString().slice(0, 10);
// console.log(checkIn)
// console.log(checkOut)

// Choose a random place out of each person's places array
const getRandomPlace = (personArr) => {
  let randomIndex = Math.floor(Math.random() * personArr.length);
  return personArr[randomIndex];
};

export default function FavoritePlaces() {
  // Each person's place will be randomly selected from ourFavoritePlaces.js
  // Each person's hotel will be randomly selected after the axios fetch
  const [markPlace, setMarkPlace] = useState(getRandomPlace(markPlacesArr));
  const [jingPlace, setJingPlace] = useState(getRandomPlace(jingPlacesArr));
  const [tirasPlace, setTirasPlace] = useState(getRandomPlace(tirasPlacesArr));
  const [markHotel, setMarkHotel] = useState([]);
  const [jingHotel, setJingHotel] = useState([]);
  const [tirasHotel, setTirasHotel] = useState([]);

  // This function takes each person's randomPlace and uses the coordinates of that place to find hotels there
  const getRandomHotels = (personPlace, setHotel) => {
    const options = {
      method: "GET",
      url: "https://booking-com.p.rapidapi.com/v1/hotels/search-by-coordinates",
      params: {
        order_by: "popularity",
        adults_number: "2",
        units: "metric",
        room_number: "1",
        checkout_date: checkOut,
        filter_by_currency: "USD",
        locale: "en-gb",
        checkin_date: checkIn,
        latitude: personPlace.latitude,
        longitude: personPlace.longitude,
        categories_filter_ids: "class::2,class::4,free_cancellation::1",
        page_number: "0",
        include_adjacency: "true",
      },
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
      },
    };
    axios.request(options).then(function (response) {
      const hotels = response.data.result
      setHotel(hotels)
      // console.log(hotels)
      const randomHotel = hotels[Math.floor(Math.random() * hotels.length)]
      setHotel(randomHotel)
    }).catch(function (error) {
      console.error(error);
    });
  };
  // Choose a random hotel each time component renders
  useEffect(() => {
    (async () => {
      await getRandomHotels(markPlace, setMarkHotel);
      await getRandomHotels(jingPlace, setJingHotel);
      await getRandomHotels(tirasPlace, setTirasHotel);
    })();
  }, []);

  return (
    <main>
      <div className="favorite-place-container">
        <h2>Mark's Suggestion:</h2>
        <h5>{markPlace.place}</h5>
        <h4>Why He Loves it There:</h4>
        <span>"{markPlace.testimonial}" -Mark</span>
        {/* <button onClick={() => getRandomHotels(markPlace, setMarkHotel)}>
            Click For Random Hotel
          </button> */}
        {/* If there is a hotel ID assigned to a person's hotel state, render the following jsx */}
        {markHotel ? (
          <div className="hotel-container">
            <h4>Featured Accomodation:</h4>
            <h4>{markHotel.hotel_name}</h4>
            <img src={markHotel.max_photo_url} alt="" />
          </div>
        ) : (
          <div className="hotelcontainer">
            <h5>Sorry, there are no available hotels at {markPlace.place} tonight.</h5>
            <h6>Please use the search bar to choose other dates</h6>
          </div>
        )
        }
      </div>
      <div className="favorite-place-container">
        <h2>Jing's Suggestion:</h2>
        <h5>{jingPlace.place}</h5>
        <h4>Why She Loves it There:</h4>
        <span>"{jingPlace.testimonial}" -Jing</span>
        {/* <button onClick={() => { getRandomHotels(jingPlace, setJingHotel) }}>
                        Click For Random Hotel
                    </button> */}
        {jingHotel ? (
          <div className="hotel-container">
            <h4>Featured Accomodation:</h4>
            <h4>{jingHotel.hotel_name}</h4>
            <img src={jingHotel.max_photo_url} alt="" />
          </div>
        ) : null}
      </div>
      <div className="favorite-place-container">
        <h2>Tiras's Suggestion:</h2>
        <h5>{tirasPlace.place}</h5>
        <h4>Why He Loves it There:</h4>
        <span>"{tirasPlace.testimonial}" -Tiras</span>
        {/* <button
                        onClick={() => getRandomHotels(tirasPlace, setTirasHotel)}>
                        Click For Random Hotel
                    </button> */}
        {tirasHotel ? (
          <div className="hotel-container">
            <h4>Featured Accomodation:</h4>
            <h4>{tirasHotel.hotel_name}</h4>
            <img src={tirasHotel.max_photo_url} alt="" />
          </div>
        ) : null}
      </div>
    </main >
  );
}
