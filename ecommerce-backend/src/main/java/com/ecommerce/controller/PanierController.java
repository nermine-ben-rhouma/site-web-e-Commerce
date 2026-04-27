package com.ecommerce.controller;

import com.ecommerce.dto.PanierRequest;
import com.ecommerce.model.Panier;
import com.ecommerce.model.Produit;
import com.ecommerce.model.User;
import com.ecommerce.repository.PanierRepository;
import com.ecommerce.repository.ProduitRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/panier")
@RequiredArgsConstructor
public class PanierController {

    private final PanierRepository panierRepository;
    private final ProduitRepository produitRepository;
    private final UserRepository userRepository;

    private UserDetailsImpl getCurrentUser() {
        return (UserDetailsImpl) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public List<Panier> getMonPanier() {
        return panierRepository.findByUserId(getCurrentUser().getId());
    }

    @PostMapping
    public ResponseEntity<?> ajouter(@RequestBody PanierRequest request) {
        Long userId = getCurrentUser().getId();

        Produit produit = produitRepository.findById(request.getProduitId())
            .orElse(null);
        if (produit == null || !produit.isActif()) {
            return ResponseEntity.badRequest().body("Produit introuvable");
        }
        if (produit.getStock() < request.getQuantite()) {
            return ResponseEntity.badRequest().body("Stock insuffisant (disponible: " + produit.getStock() + ")");
        }

        Optional<Panier> existing = panierRepository.findByUserIdAndProduitId(userId, request.getProduitId());
        Panier item;
        if (existing.isPresent()) {
            item = existing.get();
            int newQte = item.getQuantite() + request.getQuantite();
            if (newQte > produit.getStock()) {
                return ResponseEntity.badRequest().body("Stock insuffisant");
            }
            item.setQuantite(newQte);
        } else {
            User user = userRepository.getReferenceById(userId);
            item = Panier.builder()
                .user(user)
                .produit(produit)
                .quantite(request.getQuantite())
                .build();
        }

        return ResponseEntity.ok(panierRepository.save(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuantite(@PathVariable Long id, @RequestBody PanierRequest request) {
        return panierRepository.findById(id).map(item -> {
            if (request.getQuantite() <= 0) {
                panierRepository.delete(item);
                return ResponseEntity.ok("Article retiré du panier");
            }
            item.setQuantite(request.getQuantite());
            return ResponseEntity.ok(panierRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimer(@PathVariable Long id) {
        if (!panierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        panierRepository.deleteById(id);
        return ResponseEntity.ok("Article supprimé du panier");
    }

    @DeleteMapping
    public ResponseEntity<?> vider() {
        panierRepository.deleteByUserId(getCurrentUser().getId());
        return ResponseEntity.ok("Panier vidé");
    }
}
