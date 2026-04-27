package com.ecommerce.controller;

import com.ecommerce.dto.JwtResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtils;
import com.ecommerce.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String token = jwtUtils.generateToken(userDetails);

            JwtResponse response = new JwtResponse();
            response.setToken(token);
            response.setId(userDetails.getId());
            response.setEmail(userDetails.getEmail());
            response.setRole(userDetails.getRole().name());

            // Récupérer nom/prénom
            userRepository.findById(userDetails.getId()).ifPresent(u -> {
                response.setNom(u.getNom());
                response.setPrenom(u.getPrenom());
            });

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Email ou mot de passe incorrect");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Cet email est déjà utilisé");
        }

        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .nom(request.getNom())
            .prenom(request.getPrenom())
            .telephone(request.getTelephone())
            .role(User.Role.CLIENT)
            .actif(true)
            .build();

        userRepository.save(user);
        return ResponseEntity.ok("Inscription réussie !");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        UserDetailsImpl userDetails = (UserDetailsImpl)
            SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/init-admin")
    public ResponseEntity<?> initAdmin() {
        // Supprimer l'ancien si existe
        userRepository.findByEmail("superadmin@shop.com")
                .ifPresent(userRepository::delete);

        // Créer avec hash frais
        User user = User.builder()
                .email("superadmin@shop.com")
                .password(passwordEncoder.encode("admin123"))
                .nom("Admin")
                .prenom("Super")
                .role(User.Role.SUPER_ADMIN)
                .actif(true)
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("Super Admin créé avec succès !");
    }
}
