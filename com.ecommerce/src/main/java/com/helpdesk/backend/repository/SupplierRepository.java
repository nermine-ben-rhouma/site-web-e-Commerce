package com.helpdesk.backend.repository;

import com.helpdesk.backend.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
