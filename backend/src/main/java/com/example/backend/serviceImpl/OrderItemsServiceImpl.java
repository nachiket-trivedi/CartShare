package com.example.backend.serviceImpl;
import com.example.backend.models.OrderItems;
import com.example.backend.repository.OrderItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.service.OrderItemsService;

import java.util.List;

@Service
public class OrderItemsServiceImpl implements OrderItemsService{

    @Autowired
    OrderItemsRepository orderItemsRepository;

    public void addOrderItem(OrderItems o1) {
        orderItemsRepository.save(o1);
    }
    public List<OrderItems> getOrdersByStore(Long id){
        if(id!=null){
            orderItemsRepository.findByStore(id);
        }else{
            return null;
        }
      return null;
    }

    public List<OrderItems> getOrdersByProduct(Long store,Long sku){
        if(store!=null && sku!=null){
            return orderItemsRepository.findByProduct(store,sku);
        }else {
            return null;
        }
    }
}
