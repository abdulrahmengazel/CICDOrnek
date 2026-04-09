package com.example.yemeksiparis.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequest(
        @NotBlank(message = "Musteri adi zorunludur")
        String customerName,
        @NotBlank(message = "Teslimat adresi zorunludur")
        String deliveryAddress,
        @Valid
        @NotEmpty(message = "Sepet bos olamaz")
        List<OrderItemRequest> items
) {
}
