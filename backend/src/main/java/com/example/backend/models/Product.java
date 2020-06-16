package com.example.backend.models;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import javax.validation.constraints.NotNull;



@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
@Table(name = "product")
public class Product {
	
	@EmbeddedId
    private ProductKey id;
	
	//private int sku;
	
	
    @ManyToOne
    @MapsId("storeId")
    @JoinColumn(name="storeId", referencedColumnName = "storeId")
    private Store store;
   
    @NotNull
    private String name;
    private String description;
    private String imageURL;
    private String brand;
	@NotNull
    private String unit;
    @NotNull
    private float price;
    
    
    public Product() {
    	
    }

	public Product(ProductKey id, Store store, @NotNull String name, String description, String imageURL, String brand,
			@NotNull String unit, @NotNull float price) {
		super();
		this.id = id;
		this.store = store;
		this.name = name;
		this.description = description;
		this.imageURL = imageURL;
		this.brand = brand;
		this.unit = unit;
		this.price = price;
	}


	public ProductKey getId() {
		return id;
	}


	public void setId(ProductKey id) {
		this.id = id;
	}


	public Store getStore() {
		return store;
	}


	public void setStore(Store store) {
		this.store = store;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getDescription() {
		return description;
	}


	public void setDescription(String description) {
		this.description = description;
	}


	public String getImageURL() {
		return imageURL;
	}


	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}


	public String getBrand() {
		return brand;
	}


	public void setBrand(String brand) {
		this.brand = brand;
	}


	public String getUnit() {
		return unit;
	}


	public void setUnit(String unit) {
		this.unit = unit;
	}


	public float getPrice() {
		return price;
	}


	public void setPrice(float price) {
		this.price = price;
	}


	


	

    

	
    
    


    
}

