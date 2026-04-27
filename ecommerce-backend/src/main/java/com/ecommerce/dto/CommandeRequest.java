package com.ecommerce.dto;

import lombok.Data;

@Data
public class CommandeRequest {
    private String adresseLivraison;
    private String notes;
}
