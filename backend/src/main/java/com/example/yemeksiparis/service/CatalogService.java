package com.example.yemeksiparis.service;

import com.example.yemeksiparis.model.MenuCategory;
import com.example.yemeksiparis.model.MenuItem;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CatalogService {

    private final List<MenuItem> menuItems = List.of(
            new MenuItem(1L, "Smash Burger", "Cift kat kofte, cheddar, kornişon ve ozel sos", MenuCategory.BURGER, new BigDecimal("245.00"), 18, 4.8, "burger"),
            new MenuItem(2L, "BBQ Chicken Pizza", "Barbeku sos, tavuk, misir ve mozzarella", MenuCategory.PIZZA, new BigDecimal("310.00"), 24, 4.7, "pizza"),
            new MenuItem(3L, "Lotus Cheesecake", "Krema dolgulu soguk tatli", MenuCategory.TATLI, new BigDecimal("155.00"), 8, 4.9, "dessert"),
            new MenuItem(4L, "Limonata", "Ev yapimi nane ve limon ferahligi", MenuCategory.ICECEK, new BigDecimal("65.00"), 4, 4.6, "drink"),
            new MenuItem(5L, "Truffle Burger", "Karamelize sogan, roka ve truffle mayonez", MenuCategory.BURGER, new BigDecimal("285.00"), 20, 4.9, "burger"),
            new MenuItem(6L, "Akdeniz Pizza", "Beyaz peynir, zeytin, domates ve feslegen", MenuCategory.PIZZA, new BigDecimal("295.00"), 22, 4.5, "pizza")
    );

    public List<MenuItem> getMenu() {
        return menuItems;
    }

    public MenuItem getMenuItem(Long id) {
        return menuItems.stream()
                .filter(item -> item.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu urunu bulunamadi"));
    }
}
