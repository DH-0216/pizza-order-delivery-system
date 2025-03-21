// import React, { useContext, useEffect, useState } from 'react'
// import {StoreContext} from '../../Context/StoreContext'
// import './UserOrder.css'
// import { assets } from '../../assets/assets';


// const UserOrder = () => {

//   const {url,token,userName} = useContext(StoreContext);
//   const[data,setData] = useState([]);

//   const fetchOrders = async () => {
//     const response = await axios.post(url+"/api/orders/userorders"+userName, {}, {headers: {token}});
//     setData(response.data.data);
    
//   }

//   useEffect(()=>{
//     if(token){
//       fetchOrders();
//     }
//   },[token])

//   return (
//     <div className="user-order">
//       <h2>My Orders</h2>
//       <div className="container">
//         {data.map((UserOrder,index)=>{
//           return(
//             <div key={index} className="user-order-order">
//               <img src={assets.parcel_icon} alt="Parcel Icon" className="parcel-icon"/>
//               <p>{UserOrder.items.map((item,index)=>{
//                 if(index=== UserOrder.items.length-1){
//                   return item.name+" x "+item.quantity
//                 }
//                 else{
//                   return item.name+" x "+item.quantity+", "
//                 }
//               })}</p>
//               <p>Rs.{UserOrder.amount}.00</p>
//               <p>Items: {UserOrder.items.length}</p>
//               <p><span>&#x25cf;</span><b>{UserOrder.status}</b></p>
//               <button>Track Order</button>

//             </div>
//           )
//         })}
       
//       </div>
      
//     </div>

   
//   )
// }

// export default UserOrder


import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import './UserOrder.css';
import { assets } from '../../assets/assets'; // Ensure the correct import
import axios from 'axios';

const UserOrder = () => {
  const { url, token, userName } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${url}/api/orders/userorders${userName}`, {}, { headers: { token } });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
      <div className="user-order-container">
        {data.length > 0 ? (
          data.map((order, index) => (
            <div key={index} className="user-order-card">
              <div className="parcel-icon-container">
                <img src={assets.parcel_icon} alt="Parcel Icon" className="parcel-icon" />
              </div>
              <div className="order-details">
                <p>
                  {order.items.map((item, i) =>
                    i === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `
                  )}
                </p>
                <p>Rs. {order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p><span>&#x25cf;</span> <b>{order.status}</b></p>
              </div>
              <button className="track-order-btn">Track Order</button>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default UserOrder;





