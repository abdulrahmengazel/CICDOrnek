package com.example.yemeksiparis.service;

import com.example.yemeksiparis.dto.OrderItemRequest;
import com.example.yemeksiparis.dto.OrderRequest;
import com.example.yemeksiparis.model.Order;
import com.example.yemeksiparis.model.OrderItem;
import com.example.yemeksiparis.model.OrderStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class OrderService {

    private final CatalogService catalogService;
    private final AtomicLong orderSequence = new AtomicLong(1001);
    private final List<Order> orders = new CopyOnWriteArrayList<>();

    public OrderService(CatalogService catalogService) {
        this.catalogService = catalogService;
        seedOrders();
    }

    public List<Order> getOrders() {
        return orders.stream()
                .sorted((left, right) -> right.createdAt().compareTo(left.createdAt()))
                .toList();
    }

    public Order createOrder(OrderRequest request) {
        List<OrderItem> items = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.items()) {
            var menuItem = catalogService.getMenuItem(itemRequest.menuItemId());
            BigDecimal totalPrice = menuItem.price().multiply(BigDecimal.valueOf(itemRequest.quantity()));
            items.add(new OrderItem(
                    menuItem.id(),
                    menuItem.name(),
                    menuItem.price(),
                    itemRequest.quantity(),
                    totalPrice
            ));
            totalAmount = totalAmount.add(totalPrice);
        }

        Order order = new Order(
                orderSequence.getAndIncrement(),
                request.customerName(),
                request.deliveryAddress(),
                List.copyOf(items),
                totalAmount,
                OrderStatus.HAZIRLANIYOR,
                30,
                LocalDateTime.now()
        );

        orders.add(0, order);
        return order;
    }

    private void seedOrders() {
        List<OrderItem> seededItems = List.of(
                new OrderItem(2L, "BBQ Chicken Pizza", new BigDecimal("310.00"), 1, new BigDecimal("310.00")),
                new OrderItem(4L, "Limonata", new BigDecimal("65.00"), 2, new BigDecimal("130.00"))
        );

        orders.add(new Order(
                orderSequence.getAndIncrement(),
                "Ayse Demir",
                "Kadikoy, Istanbul",
                seededItems,
                new BigDecimal("440.00"),
                OrderStatus.YOLDA,
                12,
                LocalDateTime.now().minusMinutes(18)
        ));
    }
}
