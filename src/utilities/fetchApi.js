import axios from "axios";

const getHotelDatas = async (hotel_id, setHotel, setPhotos) => {
  const getHotelData = async (url, setState) => {
    const options = {
      method: "GET",
      url: url,
      params: { hotel_id: hotel_id, locale: "en-gb" },
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_BOOKING_API_KEY,
        "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
      },
    };

    const response = await axios.request(options).catch(function (error) {
      console.error(error);
    });
    // if (response.data) console.log(response.data);
    setState(response.data);
  };
  // This calls a bunch of different axios urls to get different data and sets state accordingly
  const makeFetchCalls = async () => {
    await getHotelData(
      "https://booking-com.p.rapidapi.com/v1/hotels/data",
      setHotel
    );
    await getHotelData(
      "https://booking-com.p.rapidapi.com/v1/hotels/photos",
      (data) => {
        // only take first 6 photos
        data = data.slice(0, 6);
        setPhotos(data);
      }
    );
    // reviews fetch also getting 400 status errors
    // await getHotelData('https://booking-com.p.rapidapi.com/v1/hotels/reviews', setReviews)
  };
  makeFetchCalls();
};

// get room details
const getRoomDetails = async (
  checkIn,
  checkOut,
  numberOfPerson,
  hotel_id,
  setRoomPhoto,
  setRooms
) => {
  const options = {
    method: "GET",
    url: "https://booking-com.p.rapidapi.com/v1/hotels/room-list",
    params: {
      checkin_date: checkIn,
      units: "metric",
      checkout_date: checkOut,
      currency: "USD",
      locale: "en-gb",
      adults_number_by_rooms: numberOfPerson,
      hotel_id: hotel_id,
    },
    headers: {
      "X-RapidAPI-Key": process.env.REACT_APP_BOOKING_API_KEY,
      "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
    },
  };
  const response = await axios.request(options).catch(function (error) {
    console.error(error);
  });

  const rooms = response.data[0].block.slice(0, 6);
  const room = response.data[0].rooms;
  setRoomPhoto(room);
  setRooms(rooms);
};

const exportObj = {
  getHotelDatas,
  getRoomDetails,
};

export default exportObj;
