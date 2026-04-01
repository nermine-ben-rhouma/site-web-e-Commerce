package com.helpdesk.backend.controller;

import com.helpdesk.backend.Product;
import com.helpdesk.backend.repository.CategoryRepository;
import com.helpdesk.backend.repository.ProductRepository;
import com.helpdesk.backend.repository.SupplierRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final SupplierRepository supplierRepo;

    // dossier upload fixe dans ton projet
    private static final String UPLOAD_DIR =
            System.getProperty("user.dir") + File.separator + "uploads";

    public ProductController(ProductRepository productRepo,
                             CategoryRepository categoryRepo,
                             SupplierRepository supplierRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.supplierRepo = supplierRepo;
    }

    @PostMapping
    public Product create(
            @RequestParam String name,
            @RequestParam double price,
            @RequestParam int quantity,
            @RequestParam Long categoryId,
            @RequestParam Long supplierId,
            @RequestParam MultipartFile image
    ) throws IOException {

        // créer dossier uploads s'il n'existe pas
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // nom unique pour image
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

        Path filePath = uploadPath.resolve(fileName);

        // sauvegarder image
        image.transferTo(filePath.toFile());

        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setQuantity(quantity);
        product.setImageUrl("uploads/" + fileName);

        product.setCategory(categoryRepo.findById(categoryId).orElse(null));
        product.setSupplier(supplierRepo.findById(supplierId).orElse(null));

        return productRepo.save(product);
    }

    @GetMapping
    public List<Product> getAll() {
        return productRepo.findAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productRepo.deleteById(id);
    }
}