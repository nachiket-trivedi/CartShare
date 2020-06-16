package com.example.backend.controller;

import com.example.backend.models.Address;
import com.example.backend.models.Order;
import com.example.backend.models.Store;
import com.example.backend.repository.StoreRepository;
import com.example.backend.serviceImpl.OrderItemsServiceImpl;
import com.example.backend.serviceImpl.OrderServiceImpl;
import com.example.backend.serviceImpl.ProductServiceImpl;
import com.example.backend.serviceImpl.StoreServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
public class StoreController {

    @Autowired
    StoreServiceImpl storeServiceImpl;

    @Autowired
    OrderItemsServiceImpl orderItemsServiceImpl;

    @Autowired
    ProductServiceImpl productServiceImpl;

    @Autowired
    OrderServiceImpl orderServiceImpl;

	@CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @GetMapping(value = "/browseStores", headers = "Accept=application/json", produces = { "application/json", "application/xml"})
    public ResponseEntity<Object> browseStores(){
		System.out.println("In get all stores api");
        List<Store> allStores=storeServiceImpl.getAllStores();
        if(!allStores.isEmpty()) {
			return ResponseEntity.ok(allStores);
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
    }

	@CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @GetMapping(value = "/store/{id}", headers = "Accept=application/json", produces = { "application/json", "application/xml"})
	public ResponseEntity<Object> viewStore(@PathVariable Long id){
			Optional<Store> store = storeServiceImpl.viewStore(id);
			if(store.isPresent()) {
				return ResponseEntity.ok(store);
			}
			else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}
	}
    

    @Autowired
    private StoreRepository storeRepository;

   // @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000"})
   @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @RequestMapping(method= RequestMethod.POST, value="/addStore", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
    public ResponseEntity<?> addStore(@RequestBody Map<String, String> data) {
        Map<String,Object> response = new HashMap<String, Object>();
        System.out.println(data);
        try{
            String name=data.get("name").trim();
            System.out.println("Holaaaa");
            Store oldStore=storeServiceImpl.getStoreByName(name);

            if(oldStore!=null && !name.equals("")) {
                response.put("error", "Store Name already exists");
                return ResponseEntity.badRequest().body(response);
            }
            else {
                System.out.println(name);
                System.out.println(data);
                Store store=new Store();
                store.setName((name));
                String street=data.get("street").trim();
                String city=data.get("city").trim();
                String state=data.get("state").trim();
                String zip=data.get("zip").trim();
                if(name.equals("") || street.equals("") || city.equals("") || state.equals("") || zip.equals("")){
                    response.put("error", "Incomplete Information");
                    return ResponseEntity.badRequest().body(response);
                }else{
                    Address address=new Address();
                    address.setStreet(street.trim());
                    address.setCity(city.trim());
                    address.setState(state.trim());
                    address.setZip(zip.trim());
                    store.setAddress(address);
                    System.out.println("Store So far: "+store);
                    store=storeRepository.save(store);
                    System.out.println("Store Saved: "+store);
                    response.put("store", store);
                    return ResponseEntity.accepted().body(response);
                }

               }
        }catch(Exception e){
            System.out.println(e.getStackTrace());
            response.put("error", "Error in saving Store");
            return ResponseEntity.badRequest().body(response);

        }
    }

   // @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000"})
   @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @GetMapping(value = "/getStore/{id}", produces = { "application/json", "application/xml"})
    public ResponseEntity<?> getStore(@PathVariable(value = "id")Long id){
        Map<String,Object> response = new HashMap<String, Object>();
        try{

            Optional<Store> store = storeServiceImpl.getStoreById(id);
            System.out.println(store);
            if(store.isPresent()) {
                response.put("store", store);
                return ResponseEntity.accepted().body(response);
            }
            else {
                response.put("error", "Store not found!");
                return ResponseEntity.badRequest().body(response);
            }
        }catch(Exception e){
            System.out.println(e);
            response.put("error", "Error in retrieving Store");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000"})
    @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @GetMapping(value = "/getStoreFromName/{name}", produces = { "application/json", "application/xml"})
    public ResponseEntity<?> getStoreFromName(@PathVariable(value = "name")String name){
        Map<String,Object> response = new HashMap<String, Object>();
        try{

            Store store = storeServiceImpl.getStoreByName(name);
            System.out.println(store);
            if(store!=null) {
                response.put("store", store);
                return ResponseEntity.accepted().body(response);
            }
            else {
                response.put("error", "Store not found!");
                return ResponseEntity.badRequest().body(response);
            }
        }catch(Exception e){
            System.out.println(e);
            response.put("error", "Error in retrieving Store");
            return ResponseEntity.badRequest().body(response);
        }
    }

   // @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000"})
   @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @GetMapping(value = "/getAllStores", produces = { "application/json", "application/xml"})
    public ResponseEntity<Object> getStores(){
        Map<String,Object> response = new HashMap<String, Object>();

        try{

           List<Store> stores= storeRepository.findAll();
            System.out.println(stores);
            if(stores.size()==0) {
                response.put("error", "No Stores Found!");
                return ResponseEntity.badRequest().body(response);
            }
            else {
                response.put("Stores", stores);
                return ResponseEntity.accepted().body(response);
            }
        }catch(Exception e){
            System.out.println(e);
            response.put("error", "Error in retrieving Stores");
            return ResponseEntity.badRequest().body(response);
        }
    }

   // @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000"})
   @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @RequestMapping(method= RequestMethod.PUT, value="/updateStore", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
    public ResponseEntity<?> updateStore(@RequestBody Map<String, String> data) {
        Map<String,Object> response = new HashMap<String, Object>();
        System.out.println(data);
        try{
            Long id=Long.parseLong(data.get("id"));
            Optional<Store> store = storeServiceImpl.getStoreById(id);
            if(store.isPresent()) {
                String name=data.get("name").trim();
                Store oldStore=storeServiceImpl.getStoreByName(name);
                if(oldStore!=null && !name.equals("") && id!=oldStore.getStoreId()) {
                    response.put("error", "Store Name already exists");
                    return ResponseEntity.badRequest().body(response);
                }else{
                    String street=data.get("street").trim();
                    String city=data.get("city").trim();
                    String state=data.get("state").trim();
                    String zip=data.get("zip").trim();
                    if(name.equals("")){
                        name=store.get().getName();
                    }
                    if(street.equals("")){
                        street=store.get().getAddress().getStreet();
                    }
                    if(city.equals("")){
                        city=store.get().getAddress().getCity();
                    }
                    if(state.equals("")){
                        state=store.get().getAddress().getState();
                    }
                    if(zip.equals("")){
                        zip=store.get().getAddress().getZip();
                    }

                        Store newStore=new Store();
                        Address address=new Address();
                        address.setStreet(street.trim());
                        address.setCity(city.trim());
                        address.setState(state.trim());
                        address.setZip(zip.trim());
                    String finalName = name;
                    store.ifPresent(store1 -> {
                            store1.setName(finalName);
                            store1.setAddress(address);
                        });
                        if(store.isPresent()){
                            System.out.println("Store So far: "+store);
                            storeRepository.save(store.get());
                            System.out.println("Store Saved: "+newStore);
                            response.put("store", store.get());
                            return ResponseEntity.accepted().body(response);
                        }else{
                            response.put("error", "Store does not exist!");
                            return ResponseEntity.badRequest().body(response);
                        }
                       }

            }else{
                response.put("error", "Store does not exist!");
                return ResponseEntity.badRequest().body(response);
            }
        }catch(Exception e){
            System.out.println(e);
            response.put("error", "Error in updating Stores");
            return ResponseEntity.badRequest().body(response);
        }
    }

   // @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000"})
   @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @RequestMapping(method= {RequestMethod.DELETE,RequestMethod.GET}, value="/deleteStore/{id}", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
    public ResponseEntity<?> deleteStore(@PathVariable(value = "id") Long id) {
        Map<String,Object> response = new HashMap<String, Object>();
        System.out.println(id);
        try{
           // Long id1=Long.parseLong(id);
            Optional<Store> store = storeServiceImpl.getStoreById(id);
            System.out.println(store);
            if(store.isPresent()) {
//                List<OrderItems> orders=orderItemsServiceImpl.getOrdersByStore(id);
//                int counter=0;
//                if(orders!=null){
//                    for(int i=0;i<orders.size();i++){
//                        if(orders.get(i).getOrder().getOrderStatus().equals("Placed")){
//                            counter++;
//                        }
//                    }
//
//                    if(counter>0){
//                        response.put("error", "Store has unfullfiled orders!");
//                        return ResponseEntity.badRequest().body(response);
//                    }
//                }

                List<Order> orderList=orderServiceImpl.getStoreOrders(id,"Placed");
                if(orderList!=null && orderList.size()>0){
                    response.put("error", "Store has unfullfiled orders!");
                    return ResponseEntity.badRequest().body(response);
                }

                storeServiceImpl.deleteStore(id);
                productServiceImpl.deleteProductFromStore(id);

                response.put("store", store);
                return ResponseEntity.accepted().body(response);
            }
            else {
                response.put("error", "Store not found!");
                return ResponseEntity.badRequest().body(response);
            }
        }catch(Exception e){
            System.out.println(e);
            response.put("error", "Error in deleting Store");
            return ResponseEntity.badRequest().body(response);
        }
    }

}
