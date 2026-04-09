package com.example.yemeksiparis.service;

import com.example.yemeksiparis.dto.LoginRequest;
import com.example.yemeksiparis.dto.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final Map<String, DemoUser> users = Map.of(
            "demo", new DemoUser("demo", "demo123", "Ayse Demir"),
            "admin", new DemoUser("admin", "admin123", "Yonetici")
    );

    public LoginResponse login(LoginRequest request) {
        DemoUser user = users.get(request.username());

        if (user == null || !user.password().equals(request.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Kullanici adi veya sifre hatali");
        }

        return new LoginResponse(UUID.randomUUID().toString(), user.fullName());
    }

    private record DemoUser(String username, String password, String fullName) {
    }
}
