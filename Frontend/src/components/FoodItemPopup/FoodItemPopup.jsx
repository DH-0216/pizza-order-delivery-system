import React, { useContext, useState } from "react";
import "./FoodItemPopup.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const FoodItemPopup = ({
  setShowItem,
  id,
  image,
  name,
  description,
  price,
}) => {
  const { url, setCartItem } = useContext(StoreContext);
  const [localCount, setLocalCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const selectedPrice = selectedSize ? price[selectedSize] : null;
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

 const addToCart = async () => {
   if (localCount > 0 && selectedSize) {
     try {
       const cartItem = {
         userName,
         itemId: id,
         itemName: name,
         quantity: localCount,
         size: selectedSize,
         price: selectedPrice,
       };

       // Send the cart item to the backend
       const response = await axios.post(
         "http://localhost:8080/api/cart/addtocart",
         cartItem
       );

       if (response.status === 200) {
         // If the response is successful, update the cartItems state
         setCartItem((prevCartItems) => {
           const compositeKey = `${id}|${selectedSize}`;
           const existingItem = prevCartItems[compositeKey];

           // If the item already exists in the cart, increase the quantity
           if (existingItem) {
             return {
               ...prevCartItems,
               [compositeKey]: {
                 quantity: existingItem.quantity + localCount,
                 cartId: existingItem.cartId, // Preserve the cartId
               },
             };
           } else {
             // If the item doesn't exist, add it to the cart
             return {
               ...prevCartItems,
               [compositeKey]: {
                 quantity: localCount,
                 cartId: response.data.cartId, // Assuming response contains cartId
               },
             };
           }
         });

         toast.success(`${name} added to cart!`);
       } else {
         toast.error("Failed to add item to cart.");
       }
     } catch (error) {
       console.error("Error adding item to cart:", error);
       toast.error("Failed to add item to cart.");
     }
   } else {
     toast.error(
       "Please select a size and ensure the quantity is greater than 0."
     );
   }
 };


  const handleBuy = () => {
    if (token) {
      if (localCount > 0 && selectedSize) {
        addToCart(); // Send cart data after adding to the cart
        setLocalCount(0);
        setSelectedSize("");
      } else if (localCount === 0 && selectedSize === "") {
        toast.error("Please select a size and quantity before adding to cart");
      } else if (localCount === 0) {
        toast.error("Please select a quantity before adding to cart");
      } else {
        toast.error("Please select a size before adding to cart");
      }
    } else {
      toast.error("You need Sign in to add item to cart");
    }
  };

  return (
    <div className="food_item_container">
      <img
        src={url + "/api/food/image/" + image}
        alt={name}
        className="food_item_image"
      />
      <div className="food_item_details">
        <h1>{name}</h1>
        {selectedSize ? (
          <h4 className="price">
            Rs.{" "}
            {selectedPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h4>
        ) : (
          <h4 className="price">
            Rs.{" "}
            {price.small.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            - Rs.{" "}
            {price.large.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h4>
        )}
        <hr />
        <p>{description}</p>
        <hr />
        <div className="size_selector">
          <label htmlFor="size">Size:</label>
          <select
            id="size"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Choose an option</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div className="food_item_counter_container">
          <div className="quantity-container">
            <span className="quantity">Select quantity</span>
          </div>

          <div className="food_item_counter">
            <img
              onClick={() => setLocalCount((prev) => (prev > 0 ? prev - 1 : 0))}
              src={assets.remove_icon_red}
              alt="Remove"
            />
            <span>{localCount}</span>
            <img
              onClick={() => setLocalCount((prev) => prev + 1)}
              src={assets.add_icon_green}
              alt="Add"
            />
          </div>
        </div>
        <div className="add_to_cart">
          <button onClick={handleBuy}>Add to Cart</button>
        </div>
      </div>
      <i className="bi bi-x close_icon" onClick={() => setShowItem(false)} />
    </div>
  );
};

export default FoodItemPopup;
