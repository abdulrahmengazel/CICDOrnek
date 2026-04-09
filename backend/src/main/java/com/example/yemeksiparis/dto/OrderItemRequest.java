package com.example.yemeksiparis.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
        @NotNull(message = "Urun secimi zorunludur")
        Long menuItemId,
        @Min(value = 1, message = "Adet en az 1 olmalidir")
        int quantity
) {
}
