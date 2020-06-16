package com.example.backend.repository;
import com.example.backend.models.Store;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.models.OrderItems;

import java.util.List;


@Repository
public interface OrderItemsRepository extends CrudRepository<OrderItems, Long>{


@Query("SELECT o FROM OrderItems o WHERE o.storeId= ?1")
  List<OrderItems> findByStore(Long id);


  @Query("SELECT o FROM OrderItems o WHERE o.storeId= ?1 AND o.sku= ?2")
  List<OrderItems> findByProduct(Long store,Long sku);

}
