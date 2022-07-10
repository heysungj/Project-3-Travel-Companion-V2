import "./HotelListCard.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HotelListCard({
  hotel,
  checkIn,
  checkOut,
  numberOfPerson,
  marker,
}) {
  const navigate = useNavigate();

  return (
    <div className="favorite-place-container">
      <div className="favPlaceLeftCol">

        <h2>{hotel.hotel_name}</h2>
        <h3>Review Score: {hotel.review_score}</h3>
        <button
          onClick={() => {
            navigate(
              `/hotels/${hotel.hotel_id}?checkin=${checkIn}&checkout=${checkOut}&numberOfPerson=${numberOfPerson}`,
              {
                state: {
                  markers: { marker },
                },
              }
            );
          }}
        >
          Check Availability
        </button>
      </div>
      <div className="favPlaceMidCol">
        <h2>
          {hotel.currency_code}{" "}$
          {hotel.composite_price_breakdown.gross_amount_per_night.value.toFixed(
            0
          )}
        </h2>
        <p>{hotel.is_free_cancellable ? "Free cancellation" : ""}</p>
      </div>
      <div className="hotel-container">
      <img 
      className="list-page-img"
      src={hotel.max_photo_url} 
      alt="" 
      />
      <div className="img-absolute">
        <h4>From {hotel.currency_code}{" "}$
          {hotel.composite_price_breakdown.gross_amount_per_night.value.toFixed(
            0
          )}</h4>
      </div>
      </div>



      
    </div>
  );
}
