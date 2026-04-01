package com.helpdesk.backend.controller;



import com.helpdesk.backend.Supplier;
import com.helpdesk.backend.repository.SupplierRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin
public class SupplierController {

    private final SupplierRepository repo;

    public SupplierController(SupplierRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Supplier create(@RequestBody Supplier supplier) {
        return repo.save(supplier);
    }

    @GetMapping
    public List<Supplier> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Supplier getById(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id, @RequestBody Supplier s) {
        s.setId(id);
        return repo.save(s);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
