import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as ordersAPI from "../../utilities/tripOrders-api";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const [cardinfo, setCardinfo] = useState({ cardNumber: "" });

  const { state } = useLocation();
  // use navigate
  const navigate = useNavigate();
  // console.log(state);

  const {
    hotel,
    checkIn,
    checkOut,
    room,
    hotelPhoto,
    hotel_id,
    numberOfPerson,
  } = state;

  const handleChange = (e) => {
    const cardData = {
      ...cardinfo,
      [e.target.name]: e.target.value,
    };

    setCardinfo(cardData);
    // console.log(cardData);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    const addPaymentInfo = await ordersAPI.checkout(cardinfo);
    navigate("/users/myAccount");
  };

  return (
    <div className="mainContainer">
      <h1>Check Out Page</h1>
      <div className="checkoutContainer">
        <div className="leftContainer">
          <div>
            <h3>Your Booking Details</h3>
            <h5>Check-in</h5>
            <h4>{checkIn}</h4>
            <h5>Check-out</h5>
            <h4>{checkOut}</h4>
            <h5>You selected</h5>
            <p>{room.name}</p>
            <Link
              to={`/hotels/${hotel_id}?checkin=${checkIn}&checkout=${checkOut}&numberOfPerson=${numberOfPerson}`}
            >
              <button className="link">Change Your Selection</button>
            </Link>
          </div>

          <div>
            <h4>Your Price Summary</h4>
            <h5>Total $ {room.price_breakdown.gross_price}</h5>

            <p>(for {numberOfPerson} guests)</p>
          </div>
        </div>
        <div className="rightContainer">
          <div>
            <h2>{hotel.name}</h2>
            <img src={hotelPhoto} alt="" />
            <p style={{ color: "#008009" }}>
              {hotel.address}, {hotel.city}, {hotel.zip}
            </p>
            <button className="reviewBtn">{hotel.review_score}/10 </button>
            <h5>{hotel.review_score_word}</h5>
          </div>
          <form onSubmit={async (e) => handlePay(e)}>
            <div className="cardContainer">
              <h2>Payment Info</h2>

              <label>Name</label>
              <input type="text" name="name" onChange={handleChange} required />
              <label>Card Number</label>
              <input
                type="number"
                name="cardNumber"
                placeholder="Please enter 16 digits card number"
                onChange={handleChange}
                minLength={16}
                required
              />

              <label>Expiration Date</label>

              <input
                type="text"
                name="expDate"
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                disabled={cardinfo.cardNumber.length === 16 ? false : true}
              >
                Make Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
