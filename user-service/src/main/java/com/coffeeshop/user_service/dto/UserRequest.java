package com.coffeeshop.user_service.dto;

public record UserRequest(
    String username,
    String email,
    String password,
    String role
) {}