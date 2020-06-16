package com.example.backend.serviceImpl;

import com.example.backend.models.*;
import com.example.backend.repository.StoreRepository;
import com.example.backend.models.Store;
import com.example.backend.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Optional;

@Service
public class StoreServiceImpl implements StoreService{
    @Autowired
    private StoreRepository storeRepository;

    public List<Store> getAllStores(){
        List<Store> storeList = new ArrayList<Store>();
        Iterable<Store> temp=storeRepository.findAll();
        System.out.println(temp);
        storeRepository.findAll().forEach(storeList::add);
        return storeList;
    }
    public Optional<Store> viewStore(Long storeId){
    	Optional<Store> store=storeRepository.findById(storeId);
		if(storeId!=null){
		    store=storeRepository.findById(storeId);
        }
		else
		    return null;
        return store;
    }

    public Optional<Store> getStoreById(Long id) {
        if(id != null)
            return storeRepository.findById(id);
        else
            return null;
    }

    public Store getStoreByName(String name){
        if(name!=null)
            return storeRepository.findByName(name);
        else
            return null;
    }

    public void deleteStore(Long id) {
        storeRepository.deleteById(id);
    }
    
    public Store getStore(Long storeId){
        if(storeId!=null)
            return storeRepository.findStore(storeId);
        else
            return null;
    }

}
