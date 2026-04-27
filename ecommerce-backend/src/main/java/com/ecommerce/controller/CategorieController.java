package com.ecommerce.controller;

import com.ecommerce.model.Categorie;
import com.ecommerce.repository.CategorieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategorieController {

    private final CategorieRepository categorieRepository;

    @GetMapping
    public List<Categorie> getAll() {
        return categorieRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categorie> getById(@PathVariable Long id) {
        return categorieRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> create(@RequestBody Categorie categorie) {
        if (categorieRepository.existsByNom(categorie.getNom())) {
            return ResponseEntity.badRequest().body("Une catégorie avec ce nom existe déjà");
        }
        return ResponseEntity.ok(categorieRepository.save(categorie));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Categorie updated) {
        return categorieRepository.findById(id).map(c -> {
            c.setNom(updated.getNom());
            c.setDescription(updated.getDescription());
            c.setImageUrl(updated.getImageUrl());
            return ResponseEntity.ok(categorieRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!categorieRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categorieRepository.deleteById(id);
        return ResponseEntity.ok("Catégorie supprimée");
    }
}
