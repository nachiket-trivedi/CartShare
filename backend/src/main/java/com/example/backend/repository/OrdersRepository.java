package com.example.backend.repository;

import com.example.backend.models.Order;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.example.backend.models.Order;
import com.example.backend.models.Pool;


@Repository
public interface OrdersRepository extends CrudRepository<Order, Long> {
//    @Query("SELECT o FROM Order o WHERE o.pool_id= ?1")
//    List<Order> findByPoolId(long poolId);
	
	@Query("SELECT o FROM Order o WHERE o.pool = ?1 AND o.deliveryPooler = ?2 AND o.orderStatus= ?3   ")
	List <Order> findPlacedOrders(Pool pool,String nickname, String status);
	
	@Query("SELECT o FROM Order o WHERE o.pool = ?1 AND o.deliveryPooler = ?2 AND o.orderStatus= ?3  AND o.storeId=?4 ")
	List <Order> findPlacedOrdersAtStore(Pool pool,String nickname, String status, Long storeId);
	
	
    @Query("SELECT o FROM Order o WHERE o.email= ?1")
    List<Order> findByEmail(String email);
    
    @Query("SELECT o FROM Order o WHERE o.orderId = ?1 ")
	Order findByOrderId(Long orderId);
    
    @Query("SELECT o FROM Order o where o.pool= ?1 ORDER BY o.createdAt ASC")
    List<Order> findByPool(Pool pool, Pageable pageable);
    
    @Query("SELECT o FROM Order o where o.pool= ?1 and o.storeId= ?2 ORDER BY o.createdAt ASC")
    List<Order> findByPoolAndStoreid(Pool pool, long store_id, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.pool=?1 AND o.email= ?2 AND o.storeId=?3")
    List<Order> findByPoolAndEmailAndStoreId(Pool pool, String email, long store_id);

    @Query("SELECT o FROM Order o where o.storeId= ?1 AND o.orderStatus=?2")
    List <Order> findStoreOrders( Long storeId,String status);
}	
