package com.example.yemeksiparis.dto;

public record LoginResponse(
        String token,
        String fullName
) {
}
