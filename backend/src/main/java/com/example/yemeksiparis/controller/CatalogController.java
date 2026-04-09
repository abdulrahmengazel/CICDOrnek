package com.example.yemeksiparis.controller;

import com.example.yemeksiparis.model.MenuItem;
import com.example.yemeksiparis.service.CatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<MenuItem> getMenu() {
        return catalogService.getMenu();
    }
}
