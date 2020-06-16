package com.example.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@Table(name = "orderItems")
public class OrderItems {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Item_ID")
    private long itemId;
	private long productId;
	private long itemQuantity;
	private float totalPrice;
	@ManyToOne(fetch=FetchType.LAZY,optional=true)
    @JoinColumn(name="order_id", nullable=true)
    @JsonIgnoreProperties({"members"})
    private Order order;

	private long sku;
	private long storeId;
	private long poolId;
	private String productName;
	private String unit;



	public OrderItems() {
		
	}

	public OrderItems(long itemId, long productId, long itemQuantity, float totalPrice, Order order,long storeId, long sku) {
		super();
		this.itemId = itemId;
		this.productId = productId;
		this.itemQuantity = itemQuantity;
		this.totalPrice = totalPrice;
		this.order = order;
		this.storeId = storeId;
		this.sku = sku;
	}

	public long getItemId() {
		return itemId;
	}

	public void setItemId(long itemId) {
		this.itemId = itemId;
	}

	public long getProductId() {
		return productId;
	}

	public void setProductId(long productId) {
		this.productId = productId;
	}

	public long getItemQuantity() {
		return itemQuantity;
	}

	public void setItemQuantity(long itemQuantity) {
		this.itemQuantity = itemQuantity;
	}

	public float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(float totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public long getSku() {
		return sku;
	}

	public void setSku(long sku) {
		this.sku = sku;
	}

	public long getStoreId() {
		return storeId;
	}

	public void setStoreId(long storeId) {
		this.storeId = storeId;
	}

	public long getPoolId() {
		return poolId;
	}

	public void setPoolId(long poolId) {
		this.poolId = poolId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}
	

}
