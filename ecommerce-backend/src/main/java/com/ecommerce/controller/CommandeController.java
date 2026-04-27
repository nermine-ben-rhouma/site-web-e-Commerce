package com.ecommerce.controller;

import com.ecommerce.dto.CommandeRequest;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import com.ecommerce.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
@RequiredArgsConstructor
public class CommandeController {

    private final CommandeRepository commandeRepository;
    private final PanierRepository panierRepository;
    private final ProduitRepository produitRepository;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final UserRepository userRepository;

    private UserDetailsImpl getCurrentUser() {
        return (UserDetailsImpl) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
    }

    // ─── CLIENT ───────────────────────────────────────────

    /** Mes commandes (client connecté) */
    @GetMapping("/mes-commandes")
    public List<Commande> getMesCommandes() {
        return commandeRepository.findByUserIdOrderByDateCommandeDesc(getCurrentUser().getId());
    }

    /** Passer une commande depuis le panier */
    @PostMapping("/passer")
    public ResponseEntity<?> passerCommande(@RequestBody CommandeRequest request) {
        Long userId = getCurrentUser().getId();
        List<Panier> panier = panierRepository.findByUserId(userId);

        if (panier.isEmpty()) {
            return ResponseEntity.badRequest().body("Votre panier est vide");
        }

        // Vérifier le stock avant de créer la commande
        for (Panier item : panier) {
            Produit p = item.getProduit();
            if (p.getStock() < item.getQuantite()) {
                return ResponseEntity.badRequest()
                    .body("Stock insuffisant pour : " + p.getNom() + " (disponible: " + p.getStock() + ")");
            }
        }

        User user = userRepository.getReferenceById(userId);

        // Créer la commande
        Commande commande = Commande.builder()
            .user(user)
            .statut(Commande.StatutCommande.EN_ATTENTE)
            .adresseLivraison(request.getAdresseLivraison())
            .notes(request.getNotes())
            .total(0.0)
            .build();

        commande = commandeRepository.save(commande);

        // Créer les lignes de commande
        double total = 0.0;
        for (Panier item : panier) {
            Produit p = item.getProduit();

            LigneCommande ligne = LigneCommande.builder()
                .commande(commande)
                .produit(p)
                .quantite(item.getQuantite())
                .prixUnitaire(p.getPrix())
                .build();

            ligneCommandeRepository.save(ligne);

            // Décrémenter le stock
            p.setStock(p.getStock() - item.getQuantite());
            produitRepository.save(p);

            total += ligne.getSousTotal();
        }

        // Mettre à jour le total
        commande.setTotal(total);
        commandeRepository.save(commande);

        // Vider le panier
        panierRepository.deleteByUserId(userId);

        return ResponseEntity.ok(commandeRepository.findById(commande.getId()).orElse(commande));
    }

    // ─── ADMIN ────────────────────────────────────────────

    /** Toutes les commandes */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public List<Commande> getAll() {
        return commandeRepository.findAllByOrderByDateCommandeDesc();
    }

    /** Détail d'une commande */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Commande> getById(@PathVariable Long id) {
        return commandeRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /** Changer le statut */
    @PutMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> updateStatut(
        @PathVariable Long id,
        @RequestParam Commande.StatutCommande statut
    ) {
        return commandeRepository.findById(id).map(c -> {
            c.setStatut(statut);
            return ResponseEntity.ok(commandeRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Supprimer une commande */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!commandeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        commandeRepository.deleteById(id);
        return ResponseEntity.ok("Commande supprimée");
    }
}
