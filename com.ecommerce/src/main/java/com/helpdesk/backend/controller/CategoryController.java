package com.helpdesk.backend.controller;


import com.helpdesk.backend.Category;
import com.helpdesk.backend.repository.CategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class CategoryController {

    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Category create(@RequestBody Category category) {
        return repo.save(category);
    }

    @GetMapping
    public List<Category> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @RequestBody Category c) {
        c.setId(id);
        return repo.save(c);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
