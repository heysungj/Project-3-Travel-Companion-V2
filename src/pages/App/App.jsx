import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import AuthPage from "../AuthPage/AuthPage";
import IndexPage from "../IndexPage/IndexPage";
import HotelListPage from "../HotelListPage/HotelListPage";
import HotelShowPage from "../HotelShowPage/HotelShowPage";
import AccountPage from "../AccountPage/AccountPage";
import CheckoutPage from "../CheckoutPage/CheckoutPage";
import NavBar from "../../components/NavBar/NavBar";
import { getUser } from "../../utilities/users-service";

export default function App() {
  const [user, setUser] = useState(getUser());

  // this gets current location if we want to do a 'hotels near you' on the index page
  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
  }
  // getCurrentLocation();

  return (
    <main className="App">
      {user ? (
        <>
          <NavBar user={user} setUser={setUser} />
          <Routes>
            {/* Route components in here */}
            <Route path="/" element={<IndexPage />} />
            <Route path="/hotels" element={<HotelListPage />} />
            <Route
              path="/users/myAccount"
              element={<AccountPage user={user} />}
            />
            <Route
              path="/users/cart/checkout/:orderId"
              element={<CheckoutPage user={user} />}
            />
            <Route path="/hotels/:hotel_id" element={<HotelShowPage />} />
          </Routes>
        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );
}
