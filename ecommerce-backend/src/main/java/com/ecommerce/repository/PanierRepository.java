package com.ecommerce.repository;

import com.ecommerce.model.Panier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PanierRepository extends JpaRepository<Panier, Long> {
    List<Panier> findByUserId(Long userId);
    Optional<Panier> findByUserIdAndProduitId(Long userId, Long produitId);
    void deleteByUserId(Long userId);
}
