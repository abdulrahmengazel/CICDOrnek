package com.example.yemeksiparis.model;

import java.math.BigDecimal;

public record MenuItem(
        Long id,
        String name,
        String description,
        MenuCategory category,
        BigDecimal price,
        int preparationTimeMinutes,
        double rating,
        String imageTag
) {
}
