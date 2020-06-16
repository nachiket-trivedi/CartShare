package com.example.backend.serviceImpl;

import com.example.backend.models.Order;
import com.example.backend.repository.OrdersRepository;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService{

    @Autowired
    OrdersRepository ordersRepository;
    public Order addOrder(Order o1) {
        return ordersRepository.save(o1);
    }

    public List<Order> getOrdersByEmail(String email) {
        return ordersRepository.findByEmail(email);
    }

    public List<Order> getStoreOrders(Long id, String status ){
        if(id!=null && status!=null){
            return ordersRepository.findStoreOrders(id,status);
        }
        return null;
    }

//    public List<Order> getOrderByPool(long poolId) {
//        return ordersRepository.findByPoolId(poolId);
//    }
}
