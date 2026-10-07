package com.vaya.locit.api.service;

import com.vaya.locit.api.dto.LoginRequest;
import com.vaya.locit.api.dto.LoginResponse;
import com.vaya.locit.api.dto.SignupRequest;
import com.vaya.locit.api.entity.User;
import com.vaya.locit.api.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {

        if (request.getIdentifier() == null || request.getIdentifier().isBlank()) {
            throw new RuntimeException("Email or phone is required");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }

        String identifier = request.getIdentifier().trim();

        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .orElseThrow(() -> new RuntimeException("Invalid email/phone or password"));

        if (!user.getPasswordHash().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email/phone or password");
        }

        return new LoginResponse(user);
    }

    public LoginResponse signup(SignupRequest request) {

        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Name is required");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }

        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new RuntimeException("Email already exists");
        }

        if (request.getPhone() != null
                && !request.getPhone().isBlank()
                && userRepository.existsByPhone(request.getPhone().trim())) {
            throw new RuntimeException("Phone already exists");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        user.setPasswordHash(request.getPassword());
        user.setRole(request.getRole() != null ? request.getRole() : User.Role.BUYER);

        User createdUser = userRepository.save(user);

        return new LoginResponse(createdUser);
    }
}
