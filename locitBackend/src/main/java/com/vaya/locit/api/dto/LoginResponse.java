package com.vaya.locit.api.dto;

import com.vaya.locit.api.entity.User;

public class LoginResponse {

    private int userId;
    private String name;
    private String email;
    private String phone;
    private User.Role role;

    public LoginResponse(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.role = user.getRole();
    }

    public int getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public User.Role getRole() {
        return role;
    }
}
