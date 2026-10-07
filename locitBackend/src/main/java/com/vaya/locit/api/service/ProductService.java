package com.vaya.locit.api.service;

import com.vaya.locit.api.entity.Brand;
import com.vaya.locit.api.entity.Category;
import com.vaya.locit.api.entity.Inventory;
import com.vaya.locit.api.entity.Product;
import com.vaya.locit.api.entity.Shop;
import com.vaya.locit.api.repository.BrandRepository;
import com.vaya.locit.api.repository.CategoryRepository;
import com.vaya.locit.api.repository.InventoryRepository;
import com.vaya.locit.api.repository.ProductRepository;
import com.vaya.locit.api.repository.ShopRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final ShopRepository shopRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public ProductService(
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            ShopRepository shopRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository) {

        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.shopRepository = shopRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(int id) {
        return productRepository
                .findById(id)
                .orElse(null);
    }

    @Transactional
    public Product createProduct(Product product) {

        Shop shop = shopRepository.findById(product.getShop().getShopId())
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        Category category = categoryRepository.findById(product.getCategory().getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Brand brand = brandRepository.findById(product.getBrand().getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        product.setShop(shop);
        product.setCategory(category);
        product.setBrand(brand);

        Product savedProduct =
                productRepository.save(product);

        /*
         * If an inventory record already exists,
         * synchronize its stock.
         */
        Inventory inventory =
                inventoryRepository
                        .findByProductProductId(
                                savedProduct.getProductId()
                        )
                        .orElse(null);

        if (inventory != null) {

            inventory.setAvailableStock(
                    savedProduct.getStock()
            );

            inventoryRepository.save(inventory);
        }

        return savedProduct;
    }

    public List<Product> getProductsByBrand(
            int brandId) {

        return productRepository
                .findByBrandBrandId(brandId);
    }

    public List<Product> getProductsByCategory(
            int categoryId) {

        return productRepository
                .findByCategoryCategoryId(categoryId);
    }

    public List<Product> getProductsByShop(
            int shopId) {

        return productRepository
                .findByShopShopId(shopId);
    }

    public List<Product> getAvailableProductsByBrand(
            int brandId) {

        return productRepository
                .findByBrandBrandIdAndIsAvailableTrue(
                        brandId
                );
    }

    public List<Product> searchProducts(
            String productName) {

        return productRepository
                .findByProductNameContainingIgnoreCase(
                        productName
                );
    }

    @Transactional
    public Product updateProduct(
            int id,
            Product product) {

        Product existingProduct =
                productRepository
                        .findById(id)
                        .orElse(null);

        if (existingProduct == null) {
            return null;
        }

        existingProduct.setShop(product.getShop());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setBrand(product.getBrand());

        existingProduct.setProductName(
                product.getProductName()
        );

        existingProduct.setDescription(
                product.getDescription()
        );

        existingProduct.setPrice(
                product.getPrice()
        );

        existingProduct.setStock(
                product.getStock()
        );

        existingProduct.setIsAvailable(
                product.getIsAvailable()
        );

        /*
         * Synchronize Inventory
         */
        Inventory inventory =
                inventoryRepository
                        .findByProductProductId(id)
                        .orElse(null);

        if (inventory != null) {

            inventory.setAvailableStock(
                    product.getStock()
            );

            inventoryRepository.save(inventory);
        }

        return productRepository.save(
                existingProduct
        );
    }

    @Transactional
    public boolean deleteProduct(int id) {

        if (!productRepository.existsById(id)) {
            return false;
        }

        /*
         * Inventory will automatically be deleted
         * because the database has:
         *
         * ON DELETE CASCADE
         */

        productRepository.deleteById(id);

        return true;
    }
}