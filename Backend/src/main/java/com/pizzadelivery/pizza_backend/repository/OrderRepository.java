package com.pizzadelivery.pizza_backend.repository;

<<<<<<< Updated upstream
import com.pizzadelivery.pizza_backend.model.Cart;
import com.pizzadelivery.pizza_backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
=======
//import com.pizzadelivery.pizza_backend.model.Order;
//import org.springframework.data.mongodb.repository.MongoRepository;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public interface OrderRepository extends MongoRepository<Order, String> {
//    // Custom queries can be added if needed
//}


import org.springframework.data.jpa.repository.JpaRepository;
>>>>>>> Stashed changes
import org.springframework.stereotype.Repository;
import com.pizzadelivery.pizza_backend.model.Order;
import java.util.List;
import java.util.Optional;


import java.util.Optional;

@Repository
<<<<<<< Updated upstream
public interface OrderRepository extends MongoRepository<Order, String> {
    Optional<Order> findByUserName(String userName);

=======
public interface OrderRepository extends JpaRepository<Order, String> {

    // Find an order by username
    Optional<Order> findByUserName(String userName);

    // Get all orders by status (e.g., PENDING, COMPLETED)
    List<Order> findByOrderStatus(Order.OrderStatus status);

    // Find order by Stripe session ID (if stored in DB)
    Optional<Order> findByStripeSessionId(String sessionId);
>>>>>>> Stashed changes
}

