package com.example.backend.repository;

import com.example.backend.models.Store;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import java.util.List;
import java.util.Optional;


@Repository
public interface StoreRepository extends CrudRepository<Store, Long>{

    Optional<Store> findById(Long id);

    List<Store> findAll();
    void deleteById(Long id);


    @Query("SELECT s FROM Store s WHERE s.name= ?1")
    Store findByName(String name);
    
    @Query("SELECT s FROM Store s WHERE s.storeId= ?1")
    Store findStore(Long storeId);
}
