package com.coffeeshop.user_service.service;

import com.coffeeshop.user_service.dto.UserRequest;
import com.coffeeshop.user_service.model.User;
import com.coffeeshop.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public void registerUser(UserRequest userRequest) {
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
        log.info("User {} is saved", user.getId());
    }
}