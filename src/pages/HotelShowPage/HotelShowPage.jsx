import fetchApi from "../../utilities/fetchApi";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import * as ordersAPI from "../../utilities/tripOrders-api";
import ShowPageSearchBar from "../../components/ShowPageSearchBar/ShowPageSearchBar";
import Map from "../../components/Map/Map";

export default function HotelShowPage() {
  // hotel data
  const [hotel, setHotel] = useState({});
  // rooms list data
  const [rooms, setRooms] = useState([]);
  // hotel photos data
  const [photos, setPhotos] = useState([]);
  // room info contains photos
  const [roomPhoto, setRoomPhoto] = useState([]);
  const [reviews, setReviews] = useState({});

  // use navigate
  const navigate = useNavigate();
  const { hotel_id } = useParams();
  const { state } = useLocation();
  let { markers } = state;
  console.log(markers);
  const [marker, setMarkers] = useState([markers.marker]);
  const [lat, setLat] = useState(marker[0].lat);
  const [lng, setLng] = useState(marker[0].lng);
  // get checkin and checkout date from query
  const queryParams = new URLSearchParams(window.location.search);
  const checkIn = queryParams.get("checkin");
  const checkOut = queryParams.get("checkout");
  const numberOfPerson = queryParams.get("numberOfPerson");

  //any time page re-renders it will get the hotel data
  useEffect(() => {
    fetchApi.getHotelDatas(hotel_id, setHotel, setPhotos);
    fetchApi.getRoomDetails(
      checkIn,
      checkOut,
      numberOfPerson,
      hotel_id,
      setRoomPhoto,
      setRooms
    );
  }, []);

  // handle onclick
  const handleClick = async (room) => {
    console.log(room);
    let hotelPhoto = photos[0].url_1440;
    console.log(room);
    const updatedCart = await ordersAPI.addHotelToCart(
      hotel,
      room,
      checkIn,
      checkOut,
      hotel_id,
      hotelPhoto
    );
    navigate(`/users/cart/checkout/${updatedCart.id}`, {
      state: {
        hotel,
        checkIn,
        checkOut,
        room,
        hotelPhoto,
        hotel_id,
        numberOfPerson,
      },
    });
  };

  return (
    <>
      <ShowPageSearchBar
        checkIn={checkIn}
        checkOut={checkOut}
        numberOfPerson={numberOfPerson}
        hotel_id={hotel_id}
        setRoomPhoto={setRoomPhoto}
        setRooms={setRooms}
      />
      {/* {photos && <img src={photos[0].url_1440} alt="" />}  */}
      <Map
        lat={lat}
        lng={lng}
        markers={marker}
        checkIn={checkIn}
        checkOut={checkOut}
        numberOfPerson={numberOfPerson}
      />
      <h1>{hotel.name}</h1>
      {/* <span>{description.description}</span> */}
      <h3>
        Review Score: {hotel.review_score}/10: {hotel.review_score_word}
      </h3>
      <h3>Address:</h3>
      <p>{hotel.address}</p>
      <p>
        {hotel.city}, {hotel.zip}
      </p>
      <div>
        {photos &&
          photos.map((photo, index) => {
            return <img src={photo.url_1440} key={index} alt="" />;
          })}
      </div>

      {rooms &&
        rooms.map((room, index) => {
          return (
            <div key={index}>
              <img
                src={roomPhoto[room.room_id].photos[0].url_original}
                alt=""
              />
              <h4>{room.name}</h4>
              <h4>Max Occupancy: {room.max_occupancy}</h4>
              <h3>
                per night $
                {room.product_price_breakdown.gross_amount_per_night.value.toFixed(
                  2
                )}
              </h3>
              <h4>Total Cost: $ {room.price_breakdown.gross_price}</h4>
              <button onClick={() => handleClick(room)}>Select</button>
            </div>
          );
        })}
    </>
  );
}
