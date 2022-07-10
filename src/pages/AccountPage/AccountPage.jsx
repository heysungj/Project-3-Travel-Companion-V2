import { useEffect, useState } from "react"
import * as tripOrdersAPI from '../../utilities/tripOrders-api'
import TripOrderList from '../../components/TripOrderList/TripOrderList'

export default function AccountPage({ user }) {
    const [tripOrders, setTripOrders] = useState([])

    //Find a user's trip orders when page renders
    useEffect(() => {
        const fetchOrderHistory = async () => {
            const orders = await tripOrdersAPI.getOrderHistory()
            setTripOrders(orders)
        }
        fetchOrderHistory()
    }, [])


    return (
        <>
            <h3>Greetings, {user.name}</h3>
            <h1>Your Purchased Trips:</h1>
            <TripOrderList tripOrders={tripOrders} />
            <h3>Edit Your Information</h3>
        </>
    )
}