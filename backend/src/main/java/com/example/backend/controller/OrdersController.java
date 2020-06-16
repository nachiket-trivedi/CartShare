package com.example.backend.controller;

import com.example.backend.config.GlobalConfig;
import com.example.backend.models.*;
import com.example.backend.repository.OrdersRepository;
import com.example.backend.repository.PoolRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.serviceImpl.*;
import com.example.backend.utils.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class OrdersController {

	public final String clientAddress=GlobalConfig.clientAddress;
	public final String serverAddress=GlobalConfig.serverAddress;


	@Autowired
	private PoolServiceImpl poolServiceImpl;

	@Autowired
	private UserServiceImpl userServiceImpl;

	@Autowired
	private StoreServiceImpl storeServiceImpl;

	@Autowired
	private EmailService emailSer;

	@Autowired
	private PoolRepository poolRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private OrdersRepository ordersRepository;

	@Autowired
	private OrderItemsServiceImpl orderItemsServiceImpl;

	@Autowired
	private OrderServiceImpl orderServiceImpl;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private ProductServiceImpl productServiceImpl;
	
	private ArrayList<String> selfOrderDetails;

	public void setSelfOrderDetails(ArrayList<String> selfOrderDetails) {
		this.selfOrderDetails = selfOrderDetails;
	}
	public ArrayList<String> getSelfOrderDetails() {
		return this.selfOrderDetails;
	}

	@CrossOrigin(origins = { "http://3.93.9.166:8080", "http://3.93.9.166:3000" , "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = RequestMethod.POST, value = "/sendEmailWhenSkipped")
	public ResponseEntity<?> sendEmailWhenSkipped(@RequestBody Map<String, String> data) {
		
		String email = data.get("email").trim();
		ArrayList<String> ordersInfo=this.getSelfOrderDetails();
		emailSer.readyToPickupEmail(email, ordersInfo);
		return null;
	}
	
	
	@CrossOrigin(origins = { "http://3.93.9.166:8080", "http://3.93.9.166:3000" , "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = RequestMethod.POST, value = "/setSelfOrderDetails")
	public ResponseEntity<?> setSelfOrderDetails(@RequestBody Map<String, String> data) {
		
		String email = data.get("email").trim();
		System.out.println("email is " + email);
		String orderId = data.get("placedOrderId").trim();
		
		Order order = ordersRepository.findByOrderId(Long.parseLong(orderId));
		User user = userRepository.findByEmail(email);
		order.setDeliveryPooler(user.getNickname());
		order = ordersRepository.save(order);
		Long store_id = order.getStoreId();
		ArrayList<String> ordersInfo = new ArrayList<String>();
		ordersInfo.add("\n\nORDER\nOrder Total: "+order.getOrderTotal());
		List<OrderItems> orderItems = order.getOrderItems();
		System.out.println("\norderItems: " + orderItems);
		ArrayList<Product> mainProductList = new ArrayList<Product>();
		for (OrderItems orderItem : orderItems) {

			List<Product> product_list = productRepository.findBySKUAndStore(orderItem.getSku(), store_id);
			System.out.println("\nProduct_list: " + product_list);
			mainProductList.add(product_list.get(0));
			ordersInfo.add("\nProduct Name: "+product_list.get(0).getName()+"\nProduct Brand: "+product_list.get(0).getBrand()
					+"\nProduct Description: "+product_list.get(0).getDescription()+"\nProduct Price: "+product_list.get(0).getPrice()
					+"\nProduct Quantity: "+ String.valueOf(orderItem.getItemQuantity()) + "\nTotal Price (Qty * Product Price): "+ String.valueOf(orderItem.getTotalPrice()));
		}
		this.setSelfOrderDetails(ordersInfo);
		
		return null;
		//return ResponseEntity.accepted().body(user);
	}
	
	

	@CrossOrigin(origins = { "http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080" })
	@RequestMapping(method = RequestMethod.POST, value = "/placeOrder", produces = { "application/json",
			"application/xml" })
	public ResponseEntity<Object> placeOrder(@RequestBody List<Map<String, String>> data) {
		System.out.println("-------------data-" + data);
		// data=[{poolId=null, username=null, quantity=2, sku=2, storeId=1, name=Butter,
		// des=Salted Butter,
		// brand=Amul, unit=, price=3}, {poolId=null, username=null, quantity=1, sku=3,
		// storeId=1, name=Chocolate,
		// des=Dark Chocolate with roasted Almonds, brand=Hersheys, unit=, price=2.5}]
		// System.out.println("--"+ data.get(0).get("name"));
		Pool p1 = new Pool();
		List<Pool> lp1 = poolRepository.findById(Long.parseLong(data.get(0).get("poolId")));
		if (lp1.size() > 0)
			p1 = poolRepository.findById(Long.parseLong(data.get(0).get("poolId"))).get(0);
		User u1 = userRepository.findByEmail(data.get(0).get("email"));
		long sku = Long.parseLong(data.get(0).get("sku"));
		long storeId = Long.parseLong(data.get(0).get("storeId"));
		long poolId = data.get(0).get("poolId") != null ? Long.parseLong(data.get(0).get("poolId")) : 0;
		System.out.println("-----------" + poolId);
		String email = data.get(0).get("email");
		String storeName = data.get(0).get("storeName");
		double totPrice = Double.parseDouble(data.get(data.size() - 1).get("totPrice"));
		System.out.println("totprice" + totPrice);
		// String
		// deliveryPoolerEmail=data.get(data.size()-1).get("deliveryPoolerEmail");

		Order o1 = new Order();
		// o1.setOrderItems(olist1);
		o1.setOrderStatus("Placed");
		o1.setPool(p1);
		o1.setUser(u1);
		o1.setOrderTotal(totPrice);
		o1.setEmail(email);
		o1.setSku(sku);
		o1.setStoreId(storeId);
		o1.setStoreName(storeName);
		o1.setCreatedAt("" + java.time.LocalDateTime.now());
		// o1.setDeliveryPooler(deliveryPoolerEmail);
		Order o2 = orderServiceImpl.addOrder(o1);

		List<OrderItems> olist1 = new ArrayList<OrderItems>();
		int loopCount = 0;
		for (Map<String, String> h1 : data) {
			if (loopCount < data.size() - 1) {
				long quantity = Long.parseLong(h1.get("quantity"));
				String prodName = h1.get("name");
				String unit = h1.get("unit");
				long price = Long.parseLong(h1.get("price"));
				long sku1 = Long.parseLong(h1.get("sku"));
				OrderItems oi1 = new OrderItems();
				oi1.setItemQuantity(quantity);
				oi1.setProductId(Long.parseLong(sku + "" + storeId));
				oi1.setTotalPrice(price * quantity);
				oi1.setSku(sku1);
				oi1.setStoreId(storeId);
				oi1.setPoolId(poolId);
				oi1.setUnit(unit);
				oi1.setProductName(prodName);
				oi1.setOrder(o2);
				orderItemsServiceImpl.addOrderItem(oi1);
				olist1.add(oi1);
				loopCount++;
			}
		}
		return ResponseEntity.accepted().body(o2.getOrderId());
		//return null;
	}

	@CrossOrigin(origins = { "http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080" })
	@RequestMapping(method = RequestMethod.POST, value = "/fetchMyOrders", produces = { "application/json",
			"application/xml" })
	public ResponseEntity<?> fetchMyOrders(@RequestBody Map<String, String> data) {
		System.out.println("data" + data);
		long poolId = Long.parseLong(data.get("poolId"));
		String email = data.get("email");
		List<Order> myOrders = orderServiceImpl.getOrdersByEmail(email);
		System.out.println("-------myOrders" + myOrders.size());
		System.out.println("-------myOrders" + myOrders);
		return ResponseEntity.accepted().body(myOrders);
	}

	@CrossOrigin(origins = { "http://3.93.9.166:8080", "http://3.93.9.166:3000" , "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = RequestMethod.POST, value = "/getFellowOrders")
	public ResponseEntity<?> fellowOrders(@RequestBody Map<String, String> data) {

		String email = data.get("email").trim();
		System.out.println("email is " + email);
		String storeid = data.get("storeid").trim();
		System.out.println("store id is " + storeid);
		long store_id = Long.parseLong(storeid);
		// long store_id =4;

		User user = userServiceImpl.getUser(email);
		Pool tempPool = user.getPool();

		List<Order> pool_orders = ordersRepository.findByPoolAndStoreid(tempPool, store_id, PageRequest.of(0, 10)); 																			
		System.out.println("pool_orders: " + pool_orders);

		// for(Order obj: pool_orders) {
		// if(!(obj.getEmail()== email)) { //if both strings are equal
		// pool_orders.remove(obj);
		// }
		// }
		for (Iterator<Order> obj = pool_orders.iterator(); obj.hasNext();) {
			Order o = obj.next();
			if (o.getEmail().equals(email)) { // if both strings are equal
				obj.remove();
			}
		}

		//List<ArrayList<Product>> orders = new ArrayList<ArrayList<Product>>();
		//Map<Long, ArrayList<Product>> orders = new HashMap<Long, ArrayList<Product>>();
		HashMap<Long, ArrayList<HashMap<String,String>>> orders1 = new HashMap<Long, ArrayList<HashMap<String,String>>>();
		
		for (Order obj : pool_orders) {
			List<OrderItems> orderItems = obj.getOrderItems();
			System.out.println("\norderItems: " + orderItems);
			ArrayList<Product> mainProductList = new ArrayList<Product>();
			ArrayList<HashMap<String,String>> xx = new ArrayList<HashMap<String,String>>();  //arraylist of temp_orders
			
			if (obj.getDeliveryPooler() == null) {
				
				for (OrderItems orderItem : orderItems) {
					HashMap<String, String> temp_orders = new HashMap<String,String>();
					System.out.println("SKU   Storeid "+orderItem.getSku() +"  " +store_id);
					List<Product> product_list = productRepository.findBySKUAndStore(orderItem.getSku(), store_id);
					System.out.println("\nProduct_list: " + product_list);
					
					mainProductList.add(product_list.get(0));
					
					Product temp_product = product_list.get(0);
					temp_orders.put("name", temp_product.getName());
					temp_orders.put("brand", temp_product.getBrand());
					temp_orders.put("description", temp_product.getDescription());
					temp_orders.put("price",String.valueOf(temp_product.getPrice()));
					temp_orders.put("quantity",String.valueOf(orderItem.getItemQuantity()));
					temp_orders.put("total",String.valueOf(orderItem.getTotalPrice()));
					temp_orders.put("unit",orderItem.getUnit());
					
					xx.add(temp_orders);
				}
				
				//orders.put(obj.getOrderId(),mainProductList);
				orders1.put(obj.getOrderId(),xx);
			}
		}
		return ResponseEntity.accepted().body(orders1);
	}

	@CrossOrigin(origins = { "http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080" })
	@RequestMapping(method = RequestMethod.POST, value = "/updateDeliveryPooler")
	public ResponseEntity<?> updateDeliveryPooler(@RequestBody Map<String, String> data) {

		String email = data.get("email").trim();
		// System.out.println("email is " + email);
		int orderNumber = Integer.parseInt(data.get("orderNumber"));
		String storeid = data.get("storeid").trim();
		// System.out.println("store id is " + storeid);
		long store_id = Long.parseLong(storeid);
		String selectedIds = data.get("selectedOrderIds").trim();
		String[] selectedOrderIds = selectedIds.split(",");
		System.out.println("\n\n\n\nselectedIds: "+selectedIds);
		System.out.println("\n\n\n\nselectedOrderIds");
		for(int i=0;i<selectedOrderIds.length;i++)
		{
		    System.out.println("\n"+selectedOrderIds[i]);
		}
		User user = userServiceImpl.getUser(email);
		Pool tempPool = user.getPool();
		
		List<String> ordersInfo = new ArrayList<String>();
		ArrayList<String> selfOrder = this.getSelfOrderDetails();
		for(String i:selfOrder) {
			ordersInfo.add(i);
		}

		List<String> fellowpoolers = new ArrayList<String>();
		for(String id: selectedOrderIds) {
			
			Order order = ordersRepository.findByOrderId(Long.parseLong(id));
			order.setDeliveryPooler(user.getNickname());
			ordersRepository.save(order);
			fellowpoolers.add(order.getEmail());
			ordersInfo.add("\n\nORDER\nOrder Total: "+order.getOrderTotal());
			List<OrderItems> orderItems = order.getOrderItems();
			System.out.println("\norderItems: " + orderItems);
			ArrayList<Product> mainProductList = new ArrayList<Product>();
			for (OrderItems orderItem : orderItems) {

				List<Product> product_list = productRepository.findBySKUAndStore(orderItem.getSku(), store_id);
				System.out.println("\nProduct_list: " + product_list);
				mainProductList.add(product_list.get(0));
				ordersInfo.add("\nProduct Name: "+product_list.get(0).getName()+"\nProduct Brand: "+product_list.get(0).getBrand()
						+"\nProduct Description: "+product_list.get(0).getDescription()+"\nProduct Price: "+product_list.get(0).getPrice()
						+"\nProduct Quantity: "+ String.valueOf(orderItem.getItemQuantity()) + "\nTotal Price (Qty * Product Price): "+ String.valueOf(orderItem.getTotalPrice()));
			}
		}

		emailSer.readyToPickupEmail(email, ordersInfo); // sending email to the delivery pooler about the order confirmation with order details
		
		for (String fellowPoolerEmail : fellowpoolers) {
			emailSer.readyToPickupEmailToFellowPoolers(fellowPoolerEmail, store_id); // sending email to the fellow poolers
		}

		int credits = user.getCredits(); // updating the credits information
		credits = credits + 1;
		user.setCredits(credits);
		userRepository.save(user);

		return ResponseEntity.accepted().body(user);
	}

	@CrossOrigin(origins = { "http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080" })
	@RequestMapping(method = RequestMethod.POST, value = "/getPlacedOrders")
	public ResponseEntity<?> getPlacedOrders(@RequestBody Map<String, String> data) {
		String email = data.get("email").trim();
		// String email ="kaniks.k247@gmail.com";
		User user = userServiceImpl.getUser(email);
		Pool pool = user.getPool();
		String nickname = user.getNickname();
		String status = "Placed";
		List<Order> orders = ordersRepository.findPlacedOrders(pool, nickname, status);
		System.out.println(("orders are " + orders));
		if (orders.size() == 0) {
			return ResponseEntity.accepted().body("no orders found");
		} else {
			return ResponseEntity.accepted().body(orders);
		}

	}

	@CrossOrigin(origins = { "http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080" })
	@RequestMapping(method = RequestMethod.POST, value = "/getPickedOrders")
	public ResponseEntity<?> getPickedOrders(@RequestBody Map<String, String> data) {
		String email = data.get("email").trim();
		// String email= "sam@gmail.com";
		System.out.println("Holaaa::::" + email);
		User user = userServiceImpl.getUser(email);
		Pool pool = user.getPool();
		String nickname = user.getNickname();
		String status = "Picked";
		List<Order> orders = ordersRepository.findPlacedOrders(pool, nickname, status);
		System.out.println(("orders are " + orders));
		if (orders.size() == 0) {
			return ResponseEntity.accepted().body("no orders found");
		} else {
			return ResponseEntity.accepted().body(orders);
		}

	}

	@CrossOrigin(origins = { "http://3.93.9.166:8080", "http://3.93.9.166:3000" , "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = RequestMethod.POST, value = "/checkoutOrders")
	public ResponseEntity<?> checkoutOrders(@RequestBody Map<String, String> data) {
		String email = data.get("email").trim();
		String storeName = data.get("storeName").trim();
		Store store = storeServiceImpl.getStoreByName(storeName);
		Long storeId = store.getStoreId();
		System.out.println("store id is " + storeId);
		User user = userServiceImpl.getUser(email);
		Pool pool = user.getPool();
		String nickname = user.getNickname();
		String status = "Placed";
		List<Order> orders = ordersRepository.findPlacedOrdersAtStore(pool, nickname, status, storeId);
		HashSet<String> emails = new HashSet<String>();
		List<String> ordersInfo = new ArrayList<String>();
		ordersInfo
				.add("Following are the details of the orders from store " + storeName + " that need to be delivered.\n");
		ordersInfo.add("----------------------------------------\n");
		if (orders.size() == 0) {
			return ResponseEntity.accepted().body("no orders found");
		} else {
			for (Order order : orders) {
				order.setOrderStatus("Picked");
				emails.add(order.getEmail());
				order = ordersRepository.save(order);
				ordersInfo.add("\nThis order is for " + order.getUser().getScreenName()+" \n ");
				Address add = order.getUser().getAddress();
				String address = add.getStreet() + ", " + add.getCity() + ", " + add.getState() + ", " + add.getZip();
				ordersInfo.add("It has to be delivered at " + address +"\n");
				ordersInfo.add("Order details are: \n");
				List<OrderItems> orderitems = new ArrayList<OrderItems>();
				orderitems = order.getOrderItems();
				for (OrderItems item : orderitems) {
					ordersInfo.add(item.getProductName()+ "  " + item.getItemQuantity() +item.getUnit() +"   $" + item.getTotalPrice());

				}
				ordersInfo.add("\n Total Bill : $"+order.getOrderTotal());

			}
			for (String senderEmail : emails) {
				emailSer.orderPickupEmail(senderEmail, storeId, storeName);
			}
			emailSer.pickupDetailsEmail(email, ordersInfo);
			return ResponseEntity.accepted().body("Orders have been picked");
		}
	}

	@CrossOrigin(origins = { "http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080" })
	@RequestMapping(method = RequestMethod.POST, value = "/deliverOrders")
	public ResponseEntity<?> deliverOrders(@RequestBody Map<String, String> data) {
		String senderEmail = data.get("email").trim();
		Long orderId = Long.parseLong(data.get("orderId").trim());
		Order order = ordersRepository.findByOrderId(orderId);
		order.setOrderStatus("Delivered");
		order = ordersRepository.save(order);
		String storeName = order.getStoreName();
		emailSer.orderDeliveryEmail(senderEmail, storeName);
		return ResponseEntity.accepted().body(order);
	}

	@CrossOrigin(origins = { "http://3.93.9.166:8080", "http://3.93.9.166:3000" , "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = RequestMethod.POST, value = "/fellowPickup")
	public ResponseEntity<?> fellowPickup(@RequestBody Map<String, String> data) {

		String email = data.get("email").trim();
		System.out.println("email is " + email);
		User user = userServiceImpl.getUser(email);
		int credits = user.getCredits();
		credits = credits - 1;
		user.setCredits(credits);
		userRepository.save(user);

		return ResponseEntity.accepted().body(user);
	}

}
