const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const hotelSchema = require("./hotel");

const tripSchema = new Schema(
  {
    // An order belongs to a user
    user: { type: Schema.Types.ObjectId, ref: "User" },
    // A user's unpaid order is their "cart"
    isPaid: { type: Boolean, default: false },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    numberOfPeople: { type: Number, required: true },
    // hotel details
    hotelName: { type: String, required: true },
    hotelId: { type: String, required: true },
    // hotelPhoto: { type: String, required: true },
    // description: { type: String, required: true },
    price: { type: Number },
    totalPrice: { type: Number },
    roomName: { type: String, required: true },
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    hotelPhoto: { type: String },
    // city: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

tripSchema.virtual("tripId").get(function () {
  return this.id.slice(-4).toUpperCase();
});

tripSchema.statics.getCart = function (userId) {
  return this.findOneAndUpdate(
    { user: userId, isPaid: false },
    // update
    { user: userId },
    // upsert option will create the doc if
    // it doesn't exist
    { upsert: true, new: true }
  );
};

tripSchema.methods.addHotelToCart = async function (
  hotel,
  room,
  checkIn,
  checkOut,
  hotel_id,
  hotelPhoto
) {
  // cart = this means the tripSchema
  const currentOrder = this;

  currentOrder.checkIn = checkIn;
  currentOrder.checkOut = checkOut;
  currentOrder.numberOfPeople = room.nr_adults;
  currentOrder.hotelName = hotel.name;
  currentOrder.hotelId = hotel_id;
  currentOrder.hotelPhoto = hotelPhoto;
  currentOrder.price =
    room.product_price_breakdown.gross_amount_per_night.value;
  currentOrder.totalPrice = room.price_breakdown.gross_price;
  currentOrder.roomName = room.name;
  currentOrder.rating = hotel.review_score;
  // currentOrder.hotelPhoto = room.name;
  currentOrder.address = `${hotel.address},${hotel.city}, ${hotel.zip}`;

  return currentOrder.save();
};

tripSchema.methods.updateTrip = function (id, room, checkIn, checkOut) {
  const currentTrip = this;
  return console.log("in the model. currentTrip:", currentTrip);
};

module.exports = mongoose.model("TripOrder", tripSchema);
