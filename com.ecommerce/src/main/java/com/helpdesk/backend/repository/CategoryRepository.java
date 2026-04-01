package com.helpdesk.backend.repository;

import com.helpdesk.backend.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
