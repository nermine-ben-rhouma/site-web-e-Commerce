package com.ecommerce.controller;

import com.ecommerce.dto.CreateUserRequest;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Cet email est déjà utilisé");
        }

        User.Role role;
        try {
            role = User.Role.valueOf(request.getRole());
        } catch (IllegalArgumentException e) {
            role = User.Role.ADMIN;
        }

        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .nom(request.getNom())
            .prenom(request.getPrenom())
            .telephone(request.getTelephone())
            .role(role)
            .actif(true)
            .build();

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeRole(@PathVariable Long id, @RequestParam String role) {
        return userRepository.findById(id).map(u -> {
            try {
                u.setRole(User.Role.valueOf(role));
                return ResponseEntity.ok(userRepository.save(u));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Rôle invalide");
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/toggle-actif")
    public ResponseEntity<?> toggleActif(@PathVariable Long id) {
        return userRepository.findById(id).map(u -> {
            u.setActif(!u.isActif());
            return ResponseEntity.ok(userRepository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("Utilisateur supprimé");
    }
}
