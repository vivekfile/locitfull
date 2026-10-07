package com.vaya.locit.api.service;

import com.vaya.locit.api.dto.CheckoutRequest;
import com.vaya.locit.api.entity.*;
import com.vaya.locit.api.repository.CartItemRepository;
import com.vaya.locit.api.repository.OrderRepository;
import com.vaya.locit.api.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CheckoutService {

    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderItemService orderItemService;
    private final CartItemService cartItemService;

    public CheckoutService(
            CartItemRepository cartItemRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            OrderItemService orderItemService,
            CartItemService cartItemService) {

        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderItemService = orderItemService;
        this.cartItemService = cartItemService;
    }

    @Transactional
    public List<Order> checkout(CheckoutRequest request) {

        User buyer = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserUserId(request.getUserId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Your cart is empty");
        }

        Map<Integer, List<CartItem>> itemsByShop = new HashMap<>();

        for (CartItem item : cartItems) {
            int shopId = item.getProduct().getShop().getShopId();
            itemsByShop.computeIfAbsent(shopId, key -> new ArrayList<>()).add(item);
        }

        List<Order> createdOrders = new ArrayList<>();

        for (List<CartItem> shopItems : itemsByShop.values()) {

            Shop shop = shopItems.get(0).getProduct().getShop();

            double totalAmount = shopItems.stream()
                    .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                    .sum();

            Order order = new Order();
            order.setBuyer(buyer);
            order.setShop(shop);
            order.setTotalAmount(totalAmount);
            order.setOrderStatus(Order.OrderStatus.Pending);

            Order savedOrder = orderRepository.save(order);

            for (CartItem cartItem : shopItems) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setProduct(cartItem.getProduct());
                orderItem.setQuantity(cartItem.getQuantity());
                orderItemService.createOrderItem(orderItem);
            }

            createdOrders.add(savedOrder);
        }

        cartItemService.clearUserCart(request.getUserId());

        return createdOrders;
    }
}
