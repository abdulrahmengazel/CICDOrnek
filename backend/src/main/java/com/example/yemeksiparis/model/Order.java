package com.example.yemeksiparis.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record Order(
        Long id,
        String customerName,
        String deliveryAddress,
        List<OrderItem> items,
        BigDecimal totalAmount,
        OrderStatus status,
        int estimatedDeliveryMinutes,
        LocalDateTime createdAt
) {
}
