package com.example.backend.models;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;

import java.io.Serializable;
import java.util.List;

@Entity
//@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "pool")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler","orders"})
public class Pool implements Serializable{
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Pool_ID", unique = true)
    private long poolId;
    @Column(name="New_ID", unique = true)
    private String newId;
    @Column(unique = true)
    private String name;
    private String description;
    private String poolLeader;
    @Embedded
    private Address address;
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "pool",cascade = CascadeType.ALL,orphanRemoval= true)
	//@JsonIgnoreProperties({"pool"})
	private List<Order> orders;
    @OneToMany(fetch = FetchType.EAGER,mappedBy = "pool",cascade = CascadeType.ALL)
	//@JsonIgnoreProperties({"pool"})
    @JsonIgnoreProperties({"pool"})  
	private List<User> members;
    
   
    
    public Pool() {
    	
    }

	public Pool(Long poolId,String newId, String name, String description, String poolLeader, Address address, List<Order> orders,
			List<User> members) {
		super();
		this.poolId = poolId;
		this.name = name;
		this.description = description;
		this.poolLeader = poolLeader;
		this.address = address;
		this.orders = orders;
		this.members = members;
		this.newId=newId;
	}

	
	public Long getPoolId() {
		return poolId;
	}

	public void setPoolId(Long poolId) {
		this.poolId = poolId;
	}

	
	public String getNewId() {
		return newId;
	}

	public void setNewId(String newId) {
		this.newId = newId;
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

	public String getPoolLeader() {
		return poolLeader;
	}

	public void setPoolLeader(String poolLeader) {
		this.poolLeader = poolLeader;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public List<Order> getOrders() {
		return orders;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	public List<User> getMembers() {
		return members;
	}

	public void setMembers(List<User> members) {
		this.members = members;
	}

	
    
    



   


}
