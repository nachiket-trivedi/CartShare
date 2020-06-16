package com.example.backend.models;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "store")
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="storeId")
    private long storeId;
    @Column(unique = true)
    private String name;
    @Embedded
    private Address address;
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "store",cascade = CascadeType.ALL,orphanRemoval= true)
	@JsonIgnoreProperties({"store"})
	private List<Product> products;
    
	public Store() {
    }

	public Store(long storeId, String name, Address address, List<Product> products) {
		super();
		this.storeId = storeId;
		this.name = name;
		this.address = address;
		this.products = products;
	}

	public long getStoreId() {
		return storeId;
	}

	public void setStoreId(long storeId) {
		this.storeId = storeId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}



	
	
	
    
}
