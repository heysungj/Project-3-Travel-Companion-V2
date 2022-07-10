import sendRequest from "./send-request";

const BASE_URL = "/api/tripOrders";

// Retrieve an unpaid order for the logged in user
export function getCart() {
  return sendRequest(`${BASE_URL}/cart`);
}

// Add an item to the cart
export async function addHotelToCart(
  hotel,
  room,
  checkIn,
  checkOut,
  hotel_id,
  hotelPhoto
) {
  // Just send hotelId for best security (no pricing)
  return sendRequest(`${BASE_URL}/cart/new`, "POST", {
    hotel,
    room,
    checkIn,
    checkOut,
    hotel_id,
    hotelPhoto,
  });
}

export async function updateTrip(
  id,
  room,
  checkIn,
  checkOut,
  people
) {
  return sendRequest(`${BASE_URL}/history/update/${id}`, "PUT", {
    id,
    room,
    checkIn,
    checkOut,
    people
  })
}

// Updates the order's (cart's) isPaid property to true
export function checkout(cardinfo) {
  // Changing data on the server, so make it a POST request
  return sendRequest(`${BASE_URL}/cart/checkout`, "POST", { cardinfo });
}

// Return all paid orders for the logged in user
export function getOrderHistory() {
  return sendRequest(`${BASE_URL}/history`);
}

export function cancelTrip(orderId) {
  // console.log('in the triporders api', orderId)
  return sendRequest(`${BASE_URL}/history/${orderId}`, "DELETE")
}
