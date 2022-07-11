import "./ShowPageSearchBar.css";
import { useState } from "react";
import fetchApi from "../../utilities/fetchApi";

export default function ShowPageSearchBar({
  checkIn,
  checkOut,
  numberOfPerson,
  hotel_id,
  setRoomPhoto,
  setRooms,
}) {
  // console.log(searchMarkers)
  const starterData = {
    destination: "",
    checkIn: checkIn,
    checkOut: checkOut,
    numberOfAdult: numberOfPerson,
  };
  const [data, setData] = useState(starterData);
  const [disabled, setDisabled] = useState(false);

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

  return (
    <div className="listSearch">
      <div>
        <label>Check In</label>
        <input
          className="SearchInput"
          type="date"
          name="checkIn"
          value={data.checkIn}
          onChange={changeData}
          required
        />
      </div>
      <div>
        <label>Check Out</label>
        <input
          className="SearchInput"
          type="date"
          name="checkOut"
          value={data.checkOut}
          onChange={changeData}
          required
        />
      </div>
      <div>
        <label>Number of Guests</label>

        <input
          className="SearchInput"
          type="number"
          name="numberOfAdult"
          value={data.numberOfAdult}
          onChange={changeData}
          required
        />
      </div>
      {/* onClick function sets the state of the rooms to the new input arguments */}
      <button
        className="searchBtn"
        disabled={disabled}
        onClick={() =>
          fetchApi.getRoomDetails(
            data.checkIn,
            data.checkOut,
            data.numberOfAdult,
            hotel_id,
            setRoomPhoto,
            setRooms
          )
        }
      >
        Modify Your Search
      </button>
    </div>
  );
}
