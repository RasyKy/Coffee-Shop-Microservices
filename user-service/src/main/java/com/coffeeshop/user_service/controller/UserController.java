package com.coffeeshop.user_service.controller;

import com.coffeeshop.user_service.dto.UserRequest;
import com.coffeeshop.user_service.model.User;
import com.coffeeshop.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // Register
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> registerUser(@RequestBody UserRequest userRequest) {
        if (userRepository.findByEmail(userRequest.email()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        User user = User.builder()
                .username(userRequest.username())
                .email(userRequest.email())
                .password(userRequest.password())
                .role("USER")
                .build();
        userRepository.save(user);

        // FIX 1: Return JSON, not a String, to prevent Angular parsing errors
        return Collections.singletonMap("message", "User Registered Successfully");
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest loginRequest) {
        // FIX 2: Return the actual User object so Angular can save the ID
        return userRepository.findByEmailAndPassword(loginRequest.email(), loginRequest.password())
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}