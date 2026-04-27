package com.ecommerce.controller;

import com.ecommerce.model.Produit;
import com.ecommerce.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
public class ProduitController {

    private final ProduitRepository produitRepository;

    @GetMapping
    public List<Produit> getAll(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Long categorieId
    ) {
        if (search != null && !search.isEmpty()) {
            return produitRepository.findByNomContainingIgnoreCaseAndActifTrue(search);
        }
        if (categorieId != null) {
            return produitRepository.findByCategorieIdAndActifTrue(categorieId);
        }
        return produitRepository.findByActifTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produit> getById(@PathVariable Long id) {
        return produitRepository.findById(id)
            .filter(Produit::isActif)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Produit> create(@RequestBody Produit produit) {
        produit.setActif(true);
        return ResponseEntity.ok(produitRepository.save(produit));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Produit updated) {
        return produitRepository.findById(id).map(p -> {
            p.setNom(updated.getNom());
            p.setDescription(updated.getDescription());
            p.setPrix(updated.getPrix());
            p.setStock(updated.getStock());
            p.setImageUrl(updated.getImageUrl());
            p.setCategorie(updated.getCategorie());
            p.setFournisseur(updated.getFournisseur());
            return ResponseEntity.ok(produitRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return produitRepository.findById(id).map(p -> {
            p.setActif(false);
            produitRepository.save(p);
            return ResponseEntity.ok("Produit désactivé");
        }).orElse(ResponseEntity.notFound().build());
    }
}
