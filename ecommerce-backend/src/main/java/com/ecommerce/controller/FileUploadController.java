package com.ecommerce.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostMapping("/image")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Créer le dossier si inexistant
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Générer un nom unique
            String extension = getExtension(file.getOriginalFilename());
            String fileName = UUID.randomUUID().toString() + "." + extension;
            Path filePath = uploadPath.resolve(fileName);

            // Sauvegarder
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "http://localhost:8080/uploads/" + fileName;
            return ResponseEntity.ok(java.util.Map.of("url", imageUrl));

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur upload: " + e.getMessage());
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "jpg";
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot + 1).toLowerCase() : "jpg";
    }
}