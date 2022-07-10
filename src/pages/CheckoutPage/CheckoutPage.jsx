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
    <div className="checkoutMainContainer">
      <h1 style={{ color: "#0071c2" }}>Check Out Page</h1>
      <div className="checkoutContainer">
        <div className="leftContainer">
          <div className="bookingDetail">
            <h3>Your Booking Details</h3>
            <p>Check-in</p>
            <h4>{checkIn}</h4>
            <p>Check-out</p>
            <h4>{checkOut}</h4>
            <p>You selected</p>
            <h4>{room.name}</h4>
            <Link
              to={`/hotels/${hotel_id}?checkin=${checkIn}&checkout=${checkOut}&numberOfPerson=${numberOfPerson}`}
            >
              <button className="link" style={{ fontWeight: "500" }}>
                Change Your Selection
              </button>
            </Link>
          </div>

          <div className="priceDetail">
            <h4>Your Price Summary</h4>
            <h5>Total $ {room.price_breakdown.gross_price}</h5>

            <p>(for {numberOfPerson} guests)</p>
          </div>
        </div>
        <div className="rightContainer">
          <div className="hotelInfoContainer">
            <div className="checkoutHotelImg">
              <img src={hotelPhoto} alt="" />
            </div>
            <div>
              <h2>{hotel.name}</h2>
              <p style={{ color: "#008009" }}>
                {hotel.address}, {hotel.city}, {hotel.zip}
              </p>
              <button className="reviewBtn">{hotel.review_score}/10 </button>
              <h5>{hotel.review_score_word}</h5>
            </div>
          </div>
          <form onSubmit={async (e) => handlePay(e)}>
            <div className="cardContainer">
              <h2>Payment Info</h2>

              <label>Name</label>
              <input
                className="cardInput"
                type="text"
                name="name"
                onChange={handleChange}
                required
              />
              <label>Card Number</label>
              <input
                className="cardInput"
                type="number"
                name="cardNumber"
                placeholder="Please enter 16 digits card number"
                onChange={handleChange}
                minLength={16}
                required
              />

              <label>Expiration Date</label>

              <input
                className="cardInput"
                type="text"
                name="expDate"
                onChange={handleChange}
                required
              />

              <button
                className="payBtn"
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
