package com.example.backend.controller;
import com.example.backend.models.*;
import com.example.backend.repository.ProductRepository;
import com.example.backend.serviceImpl.OrderItemsServiceImpl;
import com.example.backend.serviceImpl.ProductServiceImpl;
import com.example.backend.serviceImpl.StoreServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class ProductController {


    @Autowired
    private ProductServiceImpl productServiceImpl;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StoreServiceImpl storeServiceImpl;

    @Autowired
    private OrderItemsServiceImpl orderItemsServiceImpl;

    @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @RequestMapping(method= RequestMethod.POST, value="/addProduct", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
    public ResponseEntity<?> addProduct(@RequestBody Map<String, String> data) {
        Map<String,Object> response = new HashMap<String, Object>();
        System.out.println(data);
        try{
            String name=data.get("name").trim();
            System.out.println("Hi in Add Product!!");
            System.out.println(name);
            System.out.println(data);
            String[] stores=data.get("stores").split(",");
            System.out.println(stores[0]);
            float price=Float.parseFloat(data.get("price").trim());
            String brand=data.get("brand").trim();

            String description=data.get("description").trim();

            String unit=data.get("unit");

            String sku=data.get("sku").trim();

            if(name.equals("") || description.equals("") || unit.equals("") || sku.equals("") || data.get("price").trim().equals("")){
                response.put("error", "Incomplete Information");
                return ResponseEntity.badRequest().body(response);
            }else {
                if(stores.length==0) {
                    response.put("error", "Incomplete Information");
                    return ResponseEntity.badRequest().body(response);
                }else {
                    for (int i = 0; i < stores.length; i++) {
                        Product p = new Product();
                        p.setPrice(price);
                        p.setName(name);
                        p.setBrand(brand);
                        p.setDescription(description);
                        p.setImageURL(data.get("imageURL"));
                        p.setUnit(unit);
                        if (stores[i].contains("[")) {
                            stores[i] = stores[i].substring(1);
                            System.out.println(stores[i]);
                        } else if (stores[i].contains("]")) {
                            stores[i] = stores[i].substring(0, stores[i].length() - 1);
                            System.out.println(stores[i]);
                        }
                        Store s = storeServiceImpl.getStoreById(Long.parseLong(stores[i])).get();
                        System.out.println("Reached ithe"+s.getName());
                        p.setStore(s);

                        p.setId(new ProductKey(Long.parseLong(stores[i]), Long.parseLong(sku)));
                        System.out.println(p.getId());
                        System.out.println("Product so far: "+p);
                        List<Product> oldProd=productServiceImpl.searchBySKUAndStore(Long.parseLong(sku),Long.parseLong(stores[i]));
                        if(oldProd!=null && oldProd.size()>0) {
                            response.put("error", "SKU And Store Id already exist");
                            return ResponseEntity.badRequest().body(response);
                        }
                        p=productRepository.save(p);
                        System.out.println("Product Saved: "+p);
                        response.put("p"+i+":",p);
                    }
                    return ResponseEntity.accepted().body(response);
                }
            }
        }catch(Exception e){
            System.out.println(e.getCause());

            System.out.println(e.getMessage());

            System.out.println(e.getLocalizedMessage());
            response.put("error", "Error in saving Product");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @GetMapping(value = "/getProduct/{sku}/{storeId}", produces = { "application/json", "application/xml"})
    public ResponseEntity<?> getProduct(@PathVariable(value = "sku")Long sku,@PathVariable(value = "storeId")Long storeId){
        Map<String,Object> response = new HashMap<String, Object>();
        try{

            List<Product> finalProd=productServiceImpl.searchBySKUAndStore(sku,storeId);

            System.out.println(finalProd);
            if(finalProd!=null && finalProd.size()>0) {
                response.put("product", finalProd);
                return ResponseEntity.accepted().body(response);
            }
            else {
                response.put("error", "Product not found!");
                return ResponseEntity.badRequest().body(response);
            }
        }catch(Exception e){
            System.out.println(e);
            response.put("error", "Error in retrieving Product");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @GetMapping(value = "/searchProduct/{id}/{searchType}", produces = { "application/json", "application/xml"})
    public ResponseEntity<?> searchProduct(@PathVariable(value = "id")String id,@PathVariable(value = "searchType")String searchType){
        Map<String,Object> response = new HashMap<String, Object>();
        System.out.println(id);
        System.out.println(searchType);
        try{
            searchType=searchType.trim();
            List<Product> products;
            if(id.equals("")) {
                response.put("error", "Incomplete Information");
                return ResponseEntity.badRequest().body(response);
            }else {

                if (searchType.equals("store")) {
                    System.out.println("here in store search");
                    products = productServiceImpl.searchProductByStore( Long.parseLong(id));
                    System.out.println("Produts: "+products);
                } else if (searchType.equals("sku")) {
                    System.out.println("here in sku search");
                    products = productServiceImpl.searchProductBySKU(Long.parseLong(id));
                    System.out.println("Produts: "+products);
                } else if (searchType.equals("name")) {
                    System.out.println("here in name search");
                    products = productServiceImpl.searchProductByName(id.trim());
                    System.out.println("Produts: "+products);
                } else {
                    response.put("error", "Incorrect Search Type");
                    return ResponseEntity.badRequest().body(response);
                }

                System.out.println(products);
                if (products!=null && products.size()>0) {
                    response.put("products", products);
                    return ResponseEntity.accepted().body(response);
                } else {
                    response.put("error", "Product not found!");
                    return ResponseEntity.badRequest().body(response);
                }
            }
        }catch(Exception e){
            System.out.println(e);
            response.put("error", "Error in retrieving Product");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @GetMapping(value = "/getAllProducts", produces = { "application/json", "application/xml"})
    public ResponseEntity<Object> getProducts(){
        Map<String,Object> response = new HashMap<String, Object>();
        try{
            List<Product> products= productRepository.findAll();
            System.out.println(products);
            if(products==null || products.size()==0) {
                response.put("error", "No Products Found!");
                return ResponseEntity.badRequest().body(response);
            }
            else {
                response.put("Products", products);
                return ResponseEntity.accepted().body(response);
            }
        }catch(Exception e){
            System.out.println(e);
            response.put("error", "Error in retrieving Products");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @RequestMapping(method= RequestMethod.PUT, value="/updateProduct", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
    public ResponseEntity<?> updateProduct(@RequestBody Map<String, String> data) {
        Map<String,Object> response = new HashMap<String, Object>();
        System.out.println(data);
        try{
            Long storeId=Long.parseLong(data.get("store"));
            Long sku=Long.parseLong(data.get("sku"));
            List<Product> p = productServiceImpl.searchBySKUAndStore(sku,storeId);

            if(p.size()>0) {
                String name = data.get("name");
                System.out.println("Hi in Update Product!!");
                System.out.println(name);
               System.out.println("I've come so far89d"+data.get("price"));
                float price;
                if (data.get("price")!=null) {
                    price = Float.parseFloat(data.get("price"));
                } else {
                    price = p.get(0).getPrice();
                }

                String brand = data.get("brand");
                String description = data.get("description");
                String unit = data.get("unit");
                String img=data.get("imageURL");
                System.out.println("I've come so far89");
                if (name.equals("")) {
                    System.out.println("I've come so far1");
                    name = p.get(0).getName();
                }
                if (description.equals("")) {
                    System.out.println("I've come so far2");
                    description = p.get(0).getDescription();
                }
                if (unit.equals("")) {
                    System.out.println("I've come so far3");
                    unit = p.get(0).getUnit();
                }
                if(img.equals("")){
                    System.out.println("I've come so far4");
                    img = p.get(0).getImageURL();
                }
                if(brand.equals("")){
                    System.out.println("I've come so far5");
                    brand = p.get(0).getBrand();
                }
                System.out.println("I've come so far");
                p.get(0).setPrice(price);
                p.get(0).setName(name.trim());
                p.get(0).setBrand(brand.trim());
                p.get(0).setDescription(description.trim());
                p.get(0).setImageURL(img);
                p.get(0).setUnit(unit.trim());
                System.out.println("Product so far: " + p.get(0));
                p.set(0, productRepository.save(p.get(0)));
                System.out.println("Product Saved: " + p.get(0));
                response.put("product", p.get(0));
                return ResponseEntity.accepted().body(response);

            }
        }catch(Exception e){
            System.out.println(e);
            response.put("error", "Error in updating Products");
            return ResponseEntity.badRequest().body(response);
        }
        return null;
    }

    @CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
    @RequestMapping(method= {RequestMethod.DELETE,RequestMethod.GET}, value="/deleteProduct/{sku}/{storeId}", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
    public ResponseEntity<?> deleteProduct(@PathVariable(value = "sku")Long sku,@PathVariable(value = "storeId")Long storeId) {
        Map<String,Object> response = new HashMap<String, Object>();
        System.out.println(sku);
        System.out.println(storeId);
        try{
            List<Product> finalProd=productServiceImpl.searchBySKUAndStore(sku,storeId);
            System.out.println(finalProd);

            if(finalProd!=null && finalProd.size()>0) {
                int counter=0;
                List<OrderItems> orders=orderItemsServiceImpl.getOrdersByProduct(storeId,sku);
                System.out.println("Hola Pepsps");
                System.out.println(orders+"====");
                if(orders!=null && orders.size()>0){
                    for(int i=0;i<orders.size();i++){
                        System.out.println(orders.size());
                        if(orders.get(i).getOrder().getOrderStatus().equals("Placed")){
                            counter++;
                        }
                    }
                    if(counter>0){
                        response.put("error", "There has unfullfiled orders for the Product!");
                        return ResponseEntity.badRequest().body(response);
                    }else{
                        productServiceImpl.deleteProductById(finalProd.get(0).getId());
                        response.put("product", finalProd.get(0));
                        return ResponseEntity.accepted().body(response);
                    }
                }else{
                    productServiceImpl.deleteProductById(finalProd.get(0).getId());
                    response.put("product", finalProd.get(0));
                    return ResponseEntity.accepted().body(response);
                }
            }
            else {
                response.put("error", "Product not found!");
                return ResponseEntity.badRequest().body(response);
            }
        }catch(Exception e){
            System.out.println(e);
            System.out.println(e.getCause());
            response.put("error", "Error in deleting Product");
            return ResponseEntity.badRequest().body(response);
        }
    }

}


