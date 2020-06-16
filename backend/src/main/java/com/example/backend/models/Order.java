package com.example.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.List;
import java.util.*;

@Entity
@Table(name = "orders")
public class Order {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "Order_ID")
	private long orderId;
	@ManyToOne(fetch = FetchType.LAZY, cascade = { CascadeType.ALL }, optional = true)
	@JoinColumn(name = "pool_id", nullable = true)
	@JsonIgnoreProperties({ "orders", "members" })
	private Pool pool;
	@ManyToOne(fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "pooler_id", nullable = true)
	@JsonIgnoreProperties({ "poolOrders", "pool" })
	private User user;
    @Column(columnDefinition = "varchar(255) default 'Placed'")
    private String orderStatus;
    @Column(name="orderTotal")
    private double orderTotal;
    @Column(name="deliveryPooler")
    private String deliveryPooler;
    @Embedded
    @OneToMany(fetch = FetchType.EAGER,mappedBy = "order",cascade = CascadeType.ALL,orphanRemoval= true)
   	@JsonIgnoreProperties({"order"})
   	private List<OrderItems> orderItems;
    @Column(columnDefinition="TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private String createdAt;

	private long sku;
	private long storeId;
	private String email;
	private String storeName;

	public Order() {

	}

	public Order(long orderId, Pool pool, User user, String orderStatus, float orderTotal, String deliveryPooler,

			List<OrderItems> orderItems, String createdAt, long sku, long storeId, String email, String storeName) {

		super();
		this.orderId = orderId;
		this.pool = pool;
		this.user = user;
		this.orderStatus = orderStatus;
		this.orderTotal = orderTotal;
		this.deliveryPooler = deliveryPooler;
		this.orderItems = orderItems;
		this.createdAt = createdAt;

		this.sku = sku;
		this.storeId = storeId;
		this.email = email;

		this.storeName = storeName;
	}

	public long getOrderId() {
		return orderId;
	}

	public void setOrderId(long orderId) {
		this.orderId = orderId;
	}

	public Pool getPool() {
		return pool;
	}

	public void setPool(Pool pool) {
		this.pool = pool;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(String orderStatus) {
		this.orderStatus = orderStatus;
	}

	public double getOrderTotal() {
		return orderTotal;
	}

	public void setOrderTotal(double orderTotal) {
		this.orderTotal = orderTotal;
	}

	public String getDeliveryPooler() {
		return deliveryPooler;
	}

	public void setDeliveryPooler(String deliveryPooler) {
		this.deliveryPooler = deliveryPooler;
	}

	public List<OrderItems> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(List<OrderItems> orderItems) {
		this.orderItems = orderItems;
	}

	public String getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getStoreName() {
		return storeName;
	}

	public void setStoreName(String storeName) {
		this.storeName = storeName;
	}

}
