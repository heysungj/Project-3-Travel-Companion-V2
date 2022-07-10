import './TripOrder.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faPerson,
    faBed,
} from "@fortawesome/free-solid-svg-icons";
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

        <div className="favorite-place-container">
            {!showRooms ?
                <>
                    <div className="favPlaceLeftCol">
                        <h2>{trip.hotelName}</h2>
                        {/* if check-in date isn't in the past, you can delete/edit */}
                        {!disabled
                            ? <div className='edit'>
                                <button
                                    className='searchBtn'
                                    style={{ backgroundColor: "#ff4d4d" }}
                                    onClick={() => {
                                        handleCancelBtn(trip._id)
                                        //This re-renders the component through useNavigate
                                        navigate(0)
                                    }}>
                                    Cancel This Trip
                                </button>
                                <button
                                    className='searchBtn'
                                    onClick={() => { setShowRooms(!showRooms) }}>
                                    Edit Your Reservation
                                </button>
                            </div>
                            : <div className='no-edit'>You are unable to alter a reservation with a check-in date in the past</div>
                        }
                    </div>
                    <div className="favPlaceMidCol">
                        <h3>{trip.roomName}</h3>
                        <h4>Check-in: {trip.checkIn.slice(0, 10)} </h4>
                        <h4>Check-out: {trip.checkOut.slice(0, 10)}</h4>
                        <br />
                        <h4>Total Price: {trip.totalPrice}</h4>
                        <br />
                        <h4>Number of Guests: {trip.numberOfPeople}</h4>
                    </div>
                    <div className="hotel-container">
                        <h3 className="hotelH3">Your Accommodation</h3>
                        <img src={trip.hotelPhoto} alt="" />
                    </div>
                </>
                : <>
                    <div className="favPlaceLeftCol">
                    <div className="listSearch">
                        <div>
                        <label>Check In</label>
                            <input
                                className='SearchInput'
                                type="date"
                                name="checkIn"
                                value={data.checkIn}
                                onChange={changeData}
                                placeholder="Check-in Date"
                                required
                            />
                        </div>
                        <div>
                        <label>Check Out</label>
                            <input
                                className='SearchInput'
                                type="date"
                                name="checkOut"
                                value={data.checkOut}
                                onChange={changeData}
                                placeholder="Checkout Date"
                                required
                            />
                        </div>
                        <div>
                        <label>Number of Guests</label>
                            <input
                                className='SearchInput'
                                type="number"
                                name="people"
                                value={data.people}
                                onChange={changeData}
                                required
                            />
                        </div>
                            <button
                                className='searchBtn'
                                onClick={() =>
                                    fetchAPI.getRoomDetails(
                                        data.checkIn,
                                        data.checkOut,
                                        data.people,
                                        trip.hotelId,
                                        setRoomPhoto,
                                        setRooms)
                                }>
                                Search
                            </button>
                        </div>
                    </div>
                    {rooms.length
                        ?
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
                                    <button
                                        className='headerBtn'
                                        onClick={() => { handleEdit(room) }}>
                                        Change to This Room
                                    </button>
                                </div>
                            );
                        })
                        : <p className='no-edit'>Sorry, no available rooms for those dates</p>}
                </>}
        </div>

    )
}