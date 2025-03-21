import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import './UserOrder.css';

const UserOrder = () => {
  const { url, token, userName } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${url}/api/order/getorder/${userName}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch order items: ${response.status} ${response.statusText}`
        );
      }
      const orderData = await response.json();

      // Assuming cartData is the entire response, and items are inside the "items" array
      const formattedOrderData = {};

      // Iterate over the items array
      orderData.items.forEach((item) => {
        const compositeKey = `${item.itemId}|${item.size}`;
        formattedOrderData[compositeKey] = {
          quantity: item.quantity,
          orderId: orderData.id, // Use cartData.id as the cartId
        };
      });

      // Only update state if the data has changed
      if (JSON.stringify(cartItems) !== JSON.stringify(formattedCartData)) {
        setCartItem(formattedCartData);
        console.log("Fetched and formatted cart data:", formattedCartData);
      } else {
        console.log("Cart items are already up-to-date.");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItem({}); // Clear cart items on error
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="user-order">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((UserOrder, index) => (
          <div key={index} className="user-order-order">
            {/* Replace 'parcel_icon' with actual import or valid asset */}
            <img src="/path/to/parcel_icon.png" alt="Parcel Icon" />  
            <p>
              {UserOrder.items.map((item, idx) => (
                idx === UserOrder.items.length - 1 
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              ))}
            </p>
            <p>Rs. {UserOrder.amount}.00</p>
            <p>Items: {UserOrder.items.length}</p>
            <p><span> &#x25cf;</span><b>{UserOrder.status}</b></p>
            <button>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrder;
