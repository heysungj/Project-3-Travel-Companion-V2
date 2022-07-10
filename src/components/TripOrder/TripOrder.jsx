import './TripOrder.css'
import * as ordersAPI from "../../utilities/tripOrders-api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import fetchAPI from '../../utilities/fetchApi'

// This function is called for default state of check-in/out. It gives us 'yyyy-mm-dd' format for our fetch call
const getDateString = (date) => {
    let dateString = new Date(date);
    return dateString = dateString.toISOString().slice(0, 10);
}


// This gets us yesterday's time in a numbered format that we can compare to check-in's time 
// This ensures a user can't edit a reservation for check-in dates in the past
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const convertedYst = new Date(yesterday.toUTCString());
const yesterdayTime = convertedYst.getTime();


export default function TripOrder({ trip }) {
    const [rooms, setRooms] = useState([])
    const [roomPhoto, setRoomPhoto] = useState([])
    const [checkIn, setCheckIn] = useState(getDateString(trip.checkIn))
    const [checkOut, setCheckOut] = useState(getDateString(trip.checkOut))
    const [showRooms, setShowRooms] = useState(false)
    const [people, setPeople] = useState(trip.numberOfPeople)
    const [disabled, setDisabled] = useState(false)
    const [data, setData] = useState({
        checkIn: checkIn,
        checkOut: checkOut,
        people: people
    })
    const navigate = useNavigate()

    const checkinDate = Date.parse(checkIn);


    useEffect(() => {
        setDisabled(checkinDate <= yesterdayTime ? true : false)
    }, [])



    // console.log('trip in jsx component', trip)

    const handleCancelBtn = async (orderId) => {
        // console.log(orderId)
        await ordersAPI.cancelTrip(orderId);
    }
    const handleEdit = async (room) => {
        navigate(0)
        await ordersAPI.updateTrip(
            trip.id,
            room,
            checkIn,
            checkOut,
            people
        )
    }
    const changeData = (e) => {
        const newData = {
            ...data,
            [e.target.name]: e.target.value,
        };
        setData(newData);
    };


    return (
        <div className="tripOrder-container">
            <h2>{trip.hotelName}</h2>
            <h3>{trip.roomName}</h3>
            <img src={trip.hotelPhoto} alt="" />
            <p></p>
            <p>Check-in: {trip.checkIn.slice(0, 10)} Check-out: {trip.checkOut.slice(0, 10)}</p>
            <p>Total Price: {trip.totalPrice}</p>
            <p>Number of Guests: {trip.numberOfPeople}</p>
            {!disabled && <>
            <button onClick={() => {
                handleCancelBtn(trip._id)
                //This re-renders the component through useNavigate
                navigate(0)
            }}>
                Cancel This Trip
            </button>
            <h3>Want to Choose a New Room at the Same Hotel?</h3>
                <button onClick={() => { setShowRooms(!showRooms) }}>
                    Edit Your Stay at {trip.hotelName}
                </button>
            </>}
            {showRooms && <>
                <div className="flex-row">
                    <div>
                        <label>Check In</label>
                        <input
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
                            type="date"
                            name="checkOut"
                            value={data.checkOut}
                            onChange={changeData}
                            required
                        />
                    </div>
                    <div>
                        <label>Number of People</label>
                        <input
                            type="number"
                            name="people"
                            value={data.people}
                            onChange={changeData}
                            required
                        />
                    </div>
                    <button onClick={() =>
                        fetchAPI.getRoomDetails(
                            data.checkIn,
                            data.checkOut,
                            data.people,
                            trip.hotelId,
                            setRoomPhoto,
                            setRooms)
                    }>
                        Search for Rooms
                    </button>
                </div>
                <h3>Select a New Room For Your Reservation</h3>
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
                                <h4>Total Cost: $ {room.price_breakdown.gross_price}</h4>
                                <button onClick={() => { handleEdit(room) }}>
                                    Change to This Room
                                </button>
                            </div>
                        );
                    })}
            </>}
        </div>
    )
}