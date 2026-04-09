package com.example.yemeksiparis.model;

public enum MenuCategory {
    BURGER("Burger"),
    PIZZA("Pizza"),
    TATLI("Tatli"),
    ICECEK("Icecek");

    private final String label;

    MenuCategory(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
