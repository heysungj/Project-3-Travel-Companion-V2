import { Fragment, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faPerson,
  faBed,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@react-google-maps/api";
import "./SearchBar.css";
const API_KEY = process.env.REACT_APP_BOOKING_API_KEY;

let checkIn = new Date();
let checkOut = new Date();
checkOut.setDate(checkIn.getDate() + 1);
// This makes the format 'yyyy-mm-dd' for the axios fetch
checkIn = checkIn.toISOString().slice(0, 10);
checkOut = checkOut.toISOString().slice(0, 10);

const starterData = {
  destination: "",
  checkIn: checkIn,
  checkOut: checkOut,
  numberOfAdult: 1,
};

export default function SearchBar() {
  const [data, setData] = useState(starterData);
  const [autocomplete, setAutocomplete] = useState(null);
  const [coordinates, setCoordinates] = useState({});
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const onLoad = (autoC) => setAutocomplete(autoC);

  //   convert destination to lat lng
  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();
    const city = autocomplete.getPlace().formatted_address;
    console.log("latitude: ", lat);
    console.log("longitude: ", lng);

    setData({ ...data, destination: city });
    setCoordinates({ lat, lng });
  };

  //   function handle change
  const changeData = (e) => {
    const newData = {
      ...data,
      [e.target.name]: e.target.value,
    };
    setData(newData);

    // conditons for checkin checkout date

    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);
    const convertedYst = new Date(yesterday.toUTCString());

    const yesterdayTime = convertedYst.getTime();
    const checkinDate = Date.parse(newData.checkIn);
    // const localTime = new Date(checkinDate.toLocaleString());
    const checkoutDate = Date.parse(newData.checkOut);
    if (
      checkinDate < yesterdayTime ||
      checkoutDate <= checkinDate ||
      newData.numberOfAdult < 1
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  //   function handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    // use booking api
    const options = {
      method: "GET",
      url: "https://booking-com.p.rapidapi.com/v1/hotels/search-by-coordinates",
      params: {
        order_by: "popularity",
        adults_number: data.numberOfAdult,
        units: "metric",
        room_number: "1",
        checkout_date: data.checkOut,
        filter_by_currency: "USD",
        locale: "en-gb",
        checkin_date: data.checkIn,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        // children_ages: "5,0",
        categories_filter_ids: "class::2,class::4,free_cancellation::1",
        page_number: "0",
        include_adjacency: "true",
      },
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
      },
    };

    const response = await axios.request(options).catch(function (error) {
      console.error(error);
    });
    const hotels = response.data.result;
    // console.log(hotels);
    // console.log("coordinates state is:", coordinates);
    // setData(starterData);
    // navigate to hotels page and pass state { searchResult: hotels } to HotelListPage
    navigate("/hotels", {
      state: {
        searchResult: hotels,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        coordinates: coordinates,
        numberOfPerson: data.numberOfAdult,
      },
    });
  };

  //   button onclick not working yet
  //   const handleClickMinus = () => {
  //     data.numberOfAdult--;
  //     console.log(data.numberOfAdult);
  //   };
  //   const handleClickAdd = () => {
  //     data.numberOfAdult++;
  //   };

  return (
    <div className="searchBar">
      <form onSubmit={async (e) => handleSearch(e)} autoComplete="off">
        <div className="headerSearch">
          <div className="searchItem">
            <FontAwesomeIcon icon={faBed} className="headerIcon" />
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                className="headerSearchInput"
                type="text"
                name="destination"
                value={data.destination}
                onChange={changeData}
                placeholder="Where are you going?"
                required
              />
            </Autocomplete>
          </div>
          <div className="searchItem">
            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
            <input
              className="headerSearchInput"
              type="date"
              name="checkIn"
              value={data.checkIn}
              onChange={changeData}
              placeholder="Check-in Date"
              required
            />
          </div>
          <div className="searchItem">
            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
            <input
              className="headerSearchInput"
              type="date"
              name="checkOut"
              value={data.checkOut}
              onChange={changeData}
              placeholder="Checkout Date"
              required
            />
          </div>
          <div className="searchItem">
            <FontAwesomeIcon icon={faPerson} className="headerIcon" />
            {/* <button onClick={handleClickMinus}>-</button> */}
            <input
              className="headerSearchInput"
              type="number"
              name="numberOfAdult"
              value={data.numberOfAdult}
              onChange={changeData}
              placeholder="Number of people"
              required
            />
            {/* <button onClick={handleClickAdd}>+</button> */}
          </div>
          <div className="searchItem">
            <button className="headerBtn" type="submit" disabled={disabled}>
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
