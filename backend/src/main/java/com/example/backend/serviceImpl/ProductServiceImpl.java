package com.example.backend.serviceImpl;
import com.example.backend.models.Product;
import com.example.backend.models.ProductKey;
import com.example.backend.models.Store;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.service.ProductService;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService{

    @Autowired
    private ProductRepository productRepository;

    public List<Product> search(String name, Long id, Long sku){
        if(id != null || name!=null || sku !=null)
            return productRepository.findByNameorStoreIDorSKU(name,id,sku);
        else
            return null;
    }

    public Optional<Product> searchById(ProductKey id){
        if(id!=null){
            return productRepository.findById(id);
        }else{
            return null;
        }
    }

       public List<Product> searchProductBySKU( Long sku){
        if(sku != null)
            return productRepository.findBySKU(sku);
        else
            return null;
    }


    public List<Product> searchProductByStore(Long s){
        if(s != null) {
            return productRepository.findByStore(s);
        } else
            return null;
    }

    public List<Product> searchProductByName( String name){
        if(name != null)
            return productRepository.findByName(name);
        else
            return null;
    }

        public List<Product> searchBySKUAndStore( Long sku, Long store){
        if(store != null && sku !=null)
            return productRepository.findBySKUAndStore(sku,store);
        else
            return null;
    }

    public void deleteProduct( Long sku, Long store) {
        if(store != null && sku !=null)
          productRepository.deleteProduct(sku,store);
    }

    public void deleteProductById( ProductKey id) {
        if(id!=null)
            productRepository.deleteById(id);
    }

    public void deleteProductFromStore(Long id){
        if(id!=null)
            productRepository.deleteByStore(id);
    }

}
