import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItem] = useState({});
  const [foodList, setFoodList] = useState([]);
  const userName = localStorage.getItem("userName");
  const url = "http://localhost:8080";

  // Fetch Cart Item
  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${url}/api/cart/getcart/${userName}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch cart items: ${response.status} ${response.statusText}`
        );
      }
      const cartData = await response.json();

      // Convert fetched cart data into the expected structure
      const formattedCartData = {};
      cartData.forEach((item) => {
        const compositeKey = `${item.itemId}|${item.size}`;
        formattedCartData[compositeKey] = {
          quantity: item.quantity,
          cartId: item.id, // Include cartId
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
    if (!userName) {
      console.warn("No userName found in localStorage");
      return;
    }
    fetchCartItems();
  }, [userName]); // Depend only on userName

  useEffect(() => {
    if (!cartItems || !foodList) return;

    const cartDetails = Object.entries(cartItems)
      .map(([key, { quantity, cartId }]) => {
        const [itemId, size] = key.split("|");
        const item = foodList.find((food) => food.id === itemId);

        if (!item) {
          console.warn(`Item with ID ${itemId} not found in foodList`);
          return null;
        }

        return {
          name: item.name,
          size,
          quantity,
          cartId,
        };
      })
      .filter(Boolean); // Filter out null values

    console.log("Mapped Cart Items with Cart ID:", cartDetails);
  }, [cartItems, foodList]);

  const updateCartQuantity = async (itemId, size) => {
    const compositeKey = `${itemId}|${size}`;

    if (cartItems[compositeKey]) {
      const item = foodList.find((food) => food.id === itemId);
      const quantity = cartItems[compositeKey].quantity;
      const sizePrice = item.price[size] || 0;

      if (quantity > 1) {
        const updatedQuantity = quantity - 1;
        const updatedCart = { ...cartItems };
        updatedCart[compositeKey].quantity = updatedQuantity;
        setCartItem(updatedCart);

        const updatedCartItem = {
          userName,
          itemId,
          itemName: item.name,
          quantity: updatedQuantity,
          size,
          price: sizePrice,
        };

        try {
          const response = await axios.put(
            `${url}/api/cart/updatecart/${userName}`,
            updatedCartItem
          );

          if (response.status === 200) {
            toast.success("Item quantity updated in cart!");
            fetchCartItems();
          } else {
            toast.error("Failed to update item in cart.");
          }
        } catch (error) {
          console.error("Error updating item in cart:", error);
          toast.error("Failed to update item in cart.");
        }
      }
    } else {
      toast.error("Item not found in cart.");
    }
  };

  const removeFromCart = async (itemId, size) => {
    const compositeKey = `${itemId}|${size}`;
    const currentCartItems = { ...cartItems }; // Clone the state to avoid timing issues

    if (currentCartItems[compositeKey]) {
      const cartId = currentCartItems[compositeKey].cartId;

      console.log("cartItems before deletion:", currentCartItems);
      console.log("Composite Key:", compositeKey);
      console.log("Cart ID for delete:", cartId);

      try {
        // Attempt to delete the item from the backend first
        const response = await axios.delete(
          `${url}/api/cart/deletecart/${cartId}`
        );

        if (response.status === 200) {
          // Remove item from the cloned object
          delete currentCartItems[compositeKey];
          setCartItem(currentCartItems); // Update state with the modified object
          toast.success("Item removed from cart!");
        } else {
          toast.error("Failed to delete cart item.");
        }
      } catch (error) {
        console.error("Error removing item from cart:", error);
        toast.error("Failed to remove item from cart.");
      }
    } else {
      console.log("Item not found in cart for removal:", compositeKey);
      toast.error("Item not found in cart.");
    }
  };

  // Fetch food list from the API
  const fetchFoodList = async () => {
    try {
      const response = await fetch(`${url}/api/food/getfoods`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setFoodList(data);
    } catch (error) {
      console.error("Error fetching food list:", error);
      setFoodList([]); // Handle failure by setting foodList to an empty array
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
    }
    loadData();
  }, []);

  // Calculate the total price of the items in the cart
  const getTotalPrice = () => {
    if (!cartItems || !foodList) return 0; // Ensure valid data

    return Object.entries(cartItems).reduce(
      (total, [compositeKey, { quantity }]) => {
        const [itemId, size] = compositeKey.split("|");
        const item = foodList.find((food) => food.id === itemId);

        if (item && item.price && item.price[size]) {
          const sizePrice = item.price[size]; // Fetch the price for the specific size
          total += sizePrice * quantity; // Add the item's total price to the total
        } else {
          console.warn(
            `Item with ID: ${itemId} or size: ${size} not found or price missing.`
          );
        }

        return total;
      },
      0
    );
  };

  // Calculate the final total price including delivery fee
  const lastTotalPrice = () => {
    const deliveryFee = 200; // Fixed delivery fee
    const subtotal = getTotalPrice(); // Subtotal from cart items
    return subtotal > 0 ? subtotal + deliveryFee : 0; // Add delivery fee only if subtotal is greater than 0
  };

  // Get the total number of items in the cart
  const getTotalItems = () => {
    if (!cartItems || Object.keys(cartItems).length === 0) return 0; // Ensure cartItems is valid and not empty

    return Object.values(cartItems).reduce((total, item) => {
      // Convert quantity to an integer (parse as integer), default to 0 if invalid
      const quantity = parseInt(item.quantity, 10) || 0;
      return total + quantity;
    }, 0); // Sum all quantities
  };

  const contextValue = {
    foodList,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    lastTotalPrice,
    fetchCartItems,
    setCartItem,
    url,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
