import TripOrder from "../TripOrder/TripOrder"

export default function TripOrderList({ tripOrders }) {
    const trips = tripOrders.map(trip =>
        <TripOrder
            trip={trip}
            key={trip._id}
        />
    )

    return (
        <main>
            {trips.length ? 
            trips : 
            <h2>You haven't purchased any trips yet</h2>
            }
        </main>
    )
}