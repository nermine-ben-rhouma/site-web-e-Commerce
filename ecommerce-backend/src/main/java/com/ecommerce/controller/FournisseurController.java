package com.ecommerce.controller;

import com.ecommerce.model.Fournisseur;
import com.ecommerce.repository.FournisseurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")
@RequiredArgsConstructor
public class FournisseurController {

    private final FournisseurRepository fournisseurRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public List<Fournisseur> getAll() {
        return fournisseurRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Fournisseur> getById(@PathVariable Long id) {
        return fournisseurRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Fournisseur> create(@RequestBody Fournisseur fournisseur) {
        return ResponseEntity.ok(fournisseurRepository.save(fournisseur));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Fournisseur updated) {
        return fournisseurRepository.findById(id).map(f -> {
            f.setNom(updated.getNom());
            f.setEmail(updated.getEmail());
            f.setTelephone(updated.getTelephone());
            f.setAdresse(updated.getAdresse());
            f.setSiteWeb(updated.getSiteWeb());
            return ResponseEntity.ok(fournisseurRepository.save(f));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!fournisseurRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        fournisseurRepository.deleteById(id);
        return ResponseEntity.ok("Fournisseur supprimé");
    }
}
