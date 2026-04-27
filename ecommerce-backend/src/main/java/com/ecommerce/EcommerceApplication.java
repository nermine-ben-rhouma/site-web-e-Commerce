package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class EcommerceApplication {
    public static void main(String[] args) {
        // ✅ Ajouter cette ligne temporairement
        System.out.println("HASH: " +
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                        .encode("admin123"));

        SpringApplication.run(EcommerceApplication.class, args);
    }
}
