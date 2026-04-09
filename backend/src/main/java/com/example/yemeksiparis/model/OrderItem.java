package com.example.yemeksiparis.model;

import java.math.BigDecimal;

public record OrderItem(
        Long menuItemId,
        String name,
        BigDecimal unitPrice,
        int quantity,
        BigDecimal totalPrice
) {
}
