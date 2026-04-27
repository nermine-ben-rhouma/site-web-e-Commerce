package com.ecommerce.dto;

import lombok.Data;

@Data
public class PanierRequest {
    private Long produitId;
    private Integer quantite;
}
