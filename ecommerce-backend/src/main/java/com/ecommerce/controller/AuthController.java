package com.ecommerce.controller;

import com.ecommerce.dto.JwtResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.model.User;
import com.ecommerce.model.VerificationToken;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.VerificationTokenRepository;
import com.ecommerce.security.JwtUtils;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final VerificationTokenRepository tokenRepository;

    // =========================
    // ✅ REGISTER
    // =========================
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
                .emailVerifie(false)
                .build();

        userRepository.save(user);

        // 🔐 Création token
        String token = UUID.randomUUID().toString();

        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .expirationDate(LocalDateTime.now().plusHours(24))
                .build();

        tokenRepository.save(verificationToken);

        // 📧 Envoi email
        emailService.envoyerEmailVerification(user.getEmail(), token);

        return ResponseEntity.ok("Inscription réussie ! Vérifiez votre email.");
    }

    // =========================
    // ✅ VERIFY EMAIL
    // =========================
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {

        VerificationToken verificationToken = tokenRepository.findByToken(token).orElse(null);

        if (verificationToken == null) {
            return ResponseEntity.badRequest().body("Token invalide");
        }

        if (verificationToken.isExpired()) {
            tokenRepository.delete(verificationToken);
            return ResponseEntity.badRequest().body("Token expiré");
        }

        User user = verificationToken.getUser();
        user.setEmailVerifie(true);
        userRepository.save(user);

        tokenRepository.delete(verificationToken);

        return ResponseEntity.ok("Email vérifié avec succès !");
    }

    // =========================
    // ✅ LOGIN (avec vérification email)
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // 🔒 Vérifier email
            User user = userRepository.findById(userDetails.getId()).orElseThrow();

            if (!user.isEmailVerifie() && user.getRole() == User.Role.CLIENT) {
                return ResponseEntity.status(403)
                        .body("Veuillez confirmer votre email avant de vous connecter.");
            }

            // 🔑 JWT
            String token = jwtUtils.generateToken(userDetails);

            JwtResponse response = new JwtResponse();
            response.setToken(token);
            response.setId(userDetails.getId());
            response.setEmail(userDetails.getEmail());
            response.setRole(userDetails.getRole().name());
            response.setNom(user.getNom());
            response.setPrenom(user.getPrenom());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Email ou mot de passe incorrect");
        }
    }

    // =========================
    // ✅ PROFILE
    // =========================
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        UserDetailsImpl userDetails = (UserDetailsImpl)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return userRepository.findById(userDetails.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // ✅ INIT ADMIN
    // =========================
    @GetMapping("/init-admin")
    public ResponseEntity<?> initAdmin() {

        userRepository.findByEmail("superadmin@shop.com")
                .ifPresent(userRepository::delete);

        User user = User.builder()
                .email("superadmin@shop.com")
                .password(passwordEncoder.encode("admin123"))
                .nom("Admin")
                .prenom("Super")
                .role(User.Role.SUPER_ADMIN)
                .actif(true)
                .emailVerifie(true)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok("Super Admin créé !");
    }
}