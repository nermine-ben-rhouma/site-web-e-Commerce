package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "fournisseurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String email;
    private String telephone;
    private String adresse;
    private String siteWeb;

    @OneToMany(mappedBy = "fournisseur", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Produit> produits;
}
