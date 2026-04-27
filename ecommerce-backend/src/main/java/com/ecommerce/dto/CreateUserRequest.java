package com.ecommerce.dto;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String email;
    private String password;
    private String nom;
    private String prenom;
    private String telephone;
    private String role = "ADMIN";
}
