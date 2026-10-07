package com.vaya.locit.api.service;

import com.vaya.locit.api.entity.Category;
import com.vaya.locit.api.repository.CategoryRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(int id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }
}
