package com.pizzadelivery.pizza_backend.service;

import com.pizzadelivery.pizza_backend.model.Cart;
import com.pizzadelivery.pizza_backend.model.Item;
import com.pizzadelivery.pizza_backend.model.Order;
import com.pizzadelivery.pizza_backend.model.Order.OrderStatus;
import com.pizzadelivery.pizza_backend.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Coupon;
import com.stripe.model.checkout.Session;
import com.stripe.param.CouponCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private static final Logger logger = Logger.getLogger(OrderService.class.getName());

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public String createStripeSession(Order order) {
        try {
            Stripe.apiKey = stripeSecretKey;

            // Save order first to generate a valid ID
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
            orderRepository.save(order);
            String orderId = order.getId();

            List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
            BigDecimal totalAmount = BigDecimal.ZERO;

            // Add order items
            for (Item item : order.getItems()) {
                try {
                    long quantity = Long.parseLong(item.getQuantity());
                    BigDecimal unitAmount = new BigDecimal(item.getPrice()).multiply(BigDecimal.valueOf(100));

                    if (quantity > 0 && unitAmount.compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal totalItemPrice = unitAmount.multiply(BigDecimal.valueOf(quantity));
                        totalAmount = totalAmount.add(totalItemPrice); // Accumulate total before discount

                        lineItems.add(SessionCreateParams.LineItem.builder()
                                .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("lkr")
                                        .setUnitAmount(unitAmount.longValue()) // Price per unit
                                        .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                .setName(item.getItemName())
                                                .build())
                                        .build())
                                .setQuantity(quantity)
                                .build());
                    }
                } catch (NumberFormatException e) {
                    logger.warning("Invalid item quantity or price: " + item.getItemName());
                }
            }

            // Calculate discount
            BigDecimal discountAmount = BigDecimal.ZERO;
            if (order.getDiscount() != null) {
                try {
                    BigDecimal discountPercentage = new BigDecimal(order.getDiscount()).divide(BigDecimal.valueOf(100));
                    if (discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
                        discountAmount = totalAmount.multiply(discountPercentage).divide(BigDecimal.valueOf(100));
                    }
                } catch (NumberFormatException e) {
                    logger.warning("Invalid discount percentage: " + order.getDiscount());
                }
            }

            // Convert discount to cents
            long discountAmountInCents = discountAmount.multiply(BigDecimal.valueOf(100)).longValue();

            // Create discount coupon if applicable
            List<SessionCreateParams.Discount> discounts = new ArrayList<>();
            if (discountAmountInCents > 0) {
                String couponId = createDiscountCoupon(discountAmountInCents);
                if (couponId != null) {
                    discounts.add(SessionCreateParams.Discount.builder().setCoupon(couponId).build());
                }
            }

            // Add shipping options if applicable
            List<SessionCreateParams.ShippingOption> shippingOptions = new ArrayList<>();
            if (order.getDeliveryFee() != null && order.getDeliveryFee().compareTo(BigDecimal.ZERO) > 0) {
                shippingOptions.add(SessionCreateParams.ShippingOption.builder()
                        .setShippingRateData(SessionCreateParams.ShippingOption.ShippingRateData.builder()
                                .setType(SessionCreateParams.ShippingOption.ShippingRateData.Type.FIXED_AMOUNT)
                                .setDisplayName("Delivery Fee")
                                .setFixedAmount(SessionCreateParams.ShippingOption.ShippingRateData.FixedAmount.builder()
                                        .setAmount(order.getDeliveryFee().multiply(BigDecimal.valueOf(100)).longValue())
                                        .setCurrency("lkr")
                                        .build())
                                .build())
                        .build());
            }

            // Initialize the session builder
            SessionCreateParams.Builder sessionBuilder = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .addAllLineItem(lineItems)
                    .setSuccessUrl("http://localhost:5173/verify?success=true&session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl("http://localhost:5173/verify?success=false&session_id={CHECKOUT_SESSION_ID}")
                    .putMetadata("order_id", orderId);

            // Apply discount only if it exists
            if (!discounts.isEmpty()) {
                sessionBuilder.addAllDiscount(discounts);
            }

            // Add shipping options if available
            if (!shippingOptions.isEmpty()) {
                sessionBuilder.addAllShippingOption(shippingOptions);
            }


            // Create Stripe session
            Session session = Session.create(sessionBuilder.build());
            return session.getUrl();

        } catch (StripeException e) {
            logger.severe("StripeException: " + e.getMessage());
            return "Error: " + e.getMessage();
        } catch (Exception e) {
            logger.severe("Exception: " + e.getMessage());
            return "Error: " + e.getMessage();
        }
    }

    private String createDiscountCoupon(long discountInCents) {
        try {
            CouponCreateParams couponParams = CouponCreateParams.builder()
                    .setAmountOff(discountInCents) // Discount in cents
                    .setCurrency("lkr") // Currency should match checkout
                    .build();

            Coupon coupon = Coupon.create(couponParams);
            return coupon.getId(); // Return coupon ID for checkout session
        } catch (StripeException e) {
            logger.severe("Error creating discount coupon: " + e.getMessage());
            return null;
        }
    }


    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderByUserName(String userName) {
        return orderRepository.findByUserName(userName).orElse(null);
    }

<<<<<<< Updated upstream
//    public Order getOrderByUserName(String userName) { return orderRepository.findByUserName(userName).orElse(null); }

    public Order getOrderByUserName(String userName) {
        // Fetch the order for the given user or create a new one if not found
        return orderRepository.findByUserName(userName).orElseGet(() -> {
            Order newOrder = new Order();
            newOrder.setUserName(userName);
            newOrder.setItems(new ArrayList<>()); // Initialize an empty list for items
            return newOrder;
        });
    }

=======

    public Order getOrderById(String Id) {  // Changed "UserName" to "userName" for consistency
        return orderRepository.findById(Id).orElse(null);
    }


>>>>>>> Stashed changes
    public void updatePaymentStatus(String id, Order.PaymentStatus newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setPaymentStatus(newStatus);
            orderRepository.save(order);
        }
    }

    public boolean updateOrderStatus(String id, OrderStatus newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(newStatus);
            orderRepository.save(order);
            return true;
        }
        return false;
    }

    public boolean deleteOrder(String id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }
}