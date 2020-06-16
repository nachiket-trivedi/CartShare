package com.example.backend.repository;
import com.example.backend.models.ProductKey;
import com.example.backend.models.Store;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.models.Product;
import com.example.backend.models.ProductKey;

import java.util.List;
import java.util.Optional;


@Repository
public interface ProductRepository extends CrudRepository<Product, ProductKey> {

    @Query("SELECT p FROM Product p WHERE p.name LIKE %?1% OR p.id.storeId=?2 OR  p.id.sku=?3")
    List<Product> findByNameorStoreIDorSKU(String name, long id, long sku);

    List<Product> findAll();

    Product save(Product product);

    Optional<Product> findById(Long id);
    
    @Query("DELETE FROM Product p WHERE p.id.sku=?1 AND p.id.storeId=?2")
    void deleteProduct(long sku, long store);

    @Query("DELETE FROM Product p WHERE p.id.storeId=?1")
    void deleteByStore(Long id);

    void deleteById(ProductKey id);

    //book.bookId.title
    @Query("SELECT p FROM Product p WHERE p.id.sku=?1 AND p.id.storeId=?2")
    List<Product> findBySKUAndStore(long sku, long store);

    @Query("SELECT p FROM Product p WHERE p.id.sku=?1")
    List<Product> findBySKU(long sku);

    @Query("SELECT p FROM Product p WHERE p.id.storeId=?1")
    List<Product> findByStore(long id);

    @Query("SELECT p FROM Product p WHERE p.name=?1")
    List<Product> findByName(String name);

    Optional<Product> findById(ProductKey id);


}
