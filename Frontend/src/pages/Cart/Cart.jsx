import React, { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Cart() {
  const {
    foodList,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    getTotalPrice,
    lastTotalPrice,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const totalItems = Object.values(cartItems).reduce(
    (acc, item) => acc + item.quantity, // Ensure quantity is used here
    0
  );

  const handleRemove = (itemId, size) => {
    const compositeKey = `${itemId}|${size}`;

    if (cartItems[compositeKey]) {
      const quantity = cartItems[compositeKey].quantity;

      if (quantity > 1) {
        updateCartQuantity(itemId, size);
      } else {
        removeFromCart(itemId, size);
      }
    } else {
      toast.error("Item not found in cart.");
    }
  };


  return (
    <div className="Cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Title</p>
          <p>Size</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {Object.entries(cartItems).map(([compositeKey, itemData]) => {
          const [itemId, size] = compositeKey.split("|");
          const item = foodList.find((food) => food.id === itemId);

          if (item && itemData.quantity > 0) {
            const sizePrice = item.price[size] || 0;
            return (
              <div key={compositeKey}>
                <div className="cart-items-title cart-items-item">
                  <img
                    src={`${url}/api/food/image/${item.image}`}
                    alt={item.name}
                  />
                  <p>{item.name}</p>
                  <p>{size}</p>
                  <p>RS.{sizePrice}</p>
                  <p>{itemData.quantity}</p>
                  <p>RS.{sizePrice * itemData.quantity}</p>
                  <p>
                    <button
                      type="button"
                      className="btn btn-outline-warning"
                      onClick={() => handleRemove(itemId, size)}
                    >
                      Remove
                    </button>
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>RS.{getTotalPrice()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>
                <p>RS.{getTotalPrice() === 0 ? 0 : 200}</p>
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>RS.{lastTotalPrice()}</b>
            </div>
          </div>
          <button
            onClick={() =>
              totalItems === 0
                ? toast.warn("Your cart is empty. Add items to proceed!")
                : navigate("/order")
            }
            className={`proceed-btn ${totalItems === 0 ? "disabled" : ""}`}
          >
            Proceed To Checkout
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here:</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo_code" />
              <button className="submit.btn">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
