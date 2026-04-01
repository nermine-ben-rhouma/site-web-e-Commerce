package com.helpdesk.backend.repository;

import com.helpdesk.backend.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
