package com.pizzadelivery.pizza_backend.controller;

import com.pizzadelivery.pizza_backend.model.Cart;
import com.pizzadelivery.pizza_backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Add item to the cart
    @PostMapping("/addtocart")
    public ResponseEntity<Cart> addToCart(@RequestBody Cart cartItem) {
        Cart addedItem = cartService.addToCart(cartItem);
        return ResponseEntity.ok(addedItem);
    }

    // Get cart by userName (this could return a list of cart items)
    @GetMapping("/getcart/{userName}")
    public ResponseEntity<List<Cart>> getCart(@PathVariable String userName) {
        // Fetch the list of carts associated with the given userName
        List<Cart> cart = cartService.getCartByUserName(userName);

        if (cart.isEmpty()) {
            // Return 404 Not Found if there are no carts for the given user
            return ResponseEntity.notFound().build();
        }

        // Return 200 OK with the list of carts
        return ResponseEntity.ok(cart);
    }



    // Update cart (for updating quantity, size, price, etc.)
    @PutMapping("/updatecart/{userName}")
    public ResponseEntity<Cart> updateCart(@PathVariable String userName, @RequestBody Cart cart) {
        // Ensure the cart exists before updating, find the specific cart by userName, itemId, and size
        Optional<Cart> existingCart = cartService.getCartByUserNameAndItemIdAndSize(userName, cart.getItemId(), cart.getSize());

        if (existingCart.isPresent()) {
            // If cart exists, get the existing cart object to update
            Cart cartToUpdate = existingCart.get();

            // Only update fields that need to be changed
            cartToUpdate.setItemName(cart.getItemName());
            cartToUpdate.setQuantity(cart.getQuantity());
            cartToUpdate.setPrice(cart.getPrice());

            // Save the updated cart using the service
            Cart updatedCart = cartService.updateCart(cartToUpdate);

            // Return the updated cart
            return ResponseEntity.ok(updatedCart);
        }

        // Return not found if the cart does not exist
        return ResponseEntity.notFound().build();
    }

    // Remove item from cart
    @DeleteMapping("/deletecart/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable String id) {
        cartService.removeItemFromCart(id);
        return ResponseEntity.ok().build();
    }
}
