package com.example.backend.controller;
import java.util.*;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.backend.models.User;
import com.example.backend.models.Address;
import com.example.backend.models.Order;
import com.example.backend.models.OrderItems;
import com.example.backend.models.Pool;
import com.example.backend.repository.PoolRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.serviceImpl.PoolServiceImpl;
import com.example.backend.serviceImpl.UserServiceImpl;
import com.example.backend.utils.EmailService;



@RestController
public class PoolController {
	
	@Autowired
	private PoolServiceImpl poolServiceImpl;
	
	@Autowired
	private UserServiceImpl userServiceImpl;
	
	@Autowired
	private EmailService emailSer;

	@Autowired
	private PoolRepository poolRepository;
	
	@Autowired
	private UserRepository userRepository;

	@CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method=RequestMethod.POST, value="/createPool", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
	public ResponseEntity<?> createPool(@RequestBody Map<String, String> data) {
		String email=data.get("email").trim();
		String newId=data.get("newId").trim();
		User user=userServiceImpl.getUser(email);		
		//System.out.println("user found by email "+user.getNickname());
		String nickname=user.getNickname();
		Map<String,Object> response = new HashMap<String, Object>();
		if(user.getPool()!=null) {
			//System.out.println("associated to a pool");
			response.put("error", "associated to a pool");
			return ResponseEntity.badRequest().body(response);
		}
		else {
			if(newId.contentEquals("") || newId==null) {
				 return ResponseEntity.accepted().body("PoolID required");
			 }
			else {
				//System.out.println("not associated to a pool");				
				String name=data.get("name").trim();
				 if(name.contentEquals("") || name==null) {
					 return ResponseEntity.accepted().body("Pool name required");
				 }
				 else {
					 List<Pool> ex_pool1 = poolRepository.findByNewId(newId);
					 if(ex_pool1.size() > 0){
							//response.put("error", "Pool name already exists");
					        return ResponseEntity.accepted().body("PoolID exists");
							
						}
					 else {
						 List<Pool> ex_pool = poolRepository.findByName(name);
							if(ex_pool.size() > 0){
								//response.put("error", "Pool name already exists");
						        return ResponseEntity.accepted().body("Pool name exists");
								
							}
							else {
								String street=data.get("street").trim();
								String city=data.get("city").trim();
								String state=data.get("state").trim();
								String zip=data.get("zip").trim();
								if(street.contentEquals("") || street==null || city.contentEquals("") || city==null || state.contentEquals("") || state==null || zip.contentEquals("") || zip==null) {
									return ResponseEntity.accepted().body("Address is required.");
								}
								else {
									Address add=new Address();
									
									Pool pool=new Pool();
									pool.setName(name);
									pool.setNewId(newId);
									if(data.get("description")!=null) {
										String description=data.get("description").trim();
										pool.setDescription(description);
									}
									pool.setPoolLeader(nickname);
									
									add.setStreet(street.trim());
									add.setCity(city.trim());
									add.setState(state.trim());
									add.setZip(zip.trim());
									pool.setAddress(add);
									//System.out.println("pool to be created is: "+pool);
									pool=poolRepository.save(pool);
									//System.out.println("pool saved");
									Long poolId=pool.getPoolId();
									//User newUser=new User();
									user.setPool(pool);
									user=userRepository.save(user);
									//response.put("ok", user);
							        return ResponseEntity.accepted().body("created");
								}
								
								
							}
					 }
					
				 }
			}
			
			
			
			
			
			
	    }
			
		}
	
	@CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method=RequestMethod.POST, value="/deletePool", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
	public ResponseEntity<?> deletePool(@RequestBody Map<String, String> data) {
		
		String email=data.get("email").trim();
		String name=data.get("name").trim();
		System.out.println("email is "+email);
		System.out.println("name is "+name);
		User user=userServiceImpl.getUser(email);
		Pool pool=poolServiceImpl.getPool(name);
		
		Map<String,Object> response = new HashMap<String, Object>();
		if(user.getNickname().equals(pool.getPoolLeader())) {
			if(pool.getMembers().size()>1) {
				//response.put("error", "Can not delete! Other pool members also exist!");
				System.out.println("cannot delete");
				return ResponseEntity.accepted().body("cannot delete");
			}
			else {
				Long poolId=pool.getPoolId();				
				user.setPool(null);
				User newUser=user;				
				poolServiceImpl.deletePool(poolId);
				//response.put("ok", newUser);
				userRepository.save(newUser);
				System.out.println("deleted");
				return ResponseEntity.accepted().body("deleted");
				
			}
		}
		else {
			//response.put("error", "User does not has the authority to delete the pool");
			System.out.println("no authpority");
			return ResponseEntity.accepted().body("no authority");
			
			
		}

		}
	@Transactional
	@CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method=RequestMethod.POST, value="/getPool", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
	public ResponseEntity<?> getPool(@RequestBody Map<String, String> data) {
		
		String email=data.get("email").trim();		
		User user=userServiceImpl.getUser(email);
		if(user.getPool()!=null) {
			Pool pool=user.getPool();
			return ResponseEntity.accepted().body(pool);
		}
		else {
			return ResponseEntity.accepted().body("create");			
		}
		}
	
	@CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method=RequestMethod.POST, value="/updatePool", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
	public ResponseEntity<?> updatePool(@RequestBody Map<String, String> data) {
		
		String newId=data.get("newId").trim();
		String name=data.get("name").trim();
		String description=data.get("description").trim();
		 if(name.contentEquals("") || name==null){
		    	return ResponseEntity.accepted().body("Pool name required");
				}
		 else {
			 List<Pool> ex_pool = poolRepository.findByName(name);
				if(ex_pool.size() > 0){
					//response.put("error", "Pool name already exists");
			        return ResponseEntity.accepted().body("Pool name exists");
					
				}
				else {
					Pool pool=poolServiceImpl.poolUpdate(newId);
					pool.setName(name);
					pool.setDescription(description);
					pool=poolRepository.save(pool);
					return ResponseEntity.accepted().body("Pool updated");
				}
		 }
		}
	
	@CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method=RequestMethod.POST, value="/mailIfUndelivered", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
	public ResponseEntity<?> mailIfUndelivered(@RequestBody List<Map<String, String>>  data) {
		String storeName=data.get(data.size()-1).get("storeName").trim();
		String deliveryPooler=data.get(data.size()-2).get("deliveryPooler").trim();
		String toEmail=userRepository.findByNickname(deliveryPooler).getEmail();
		String orderEmail=data.get(data.size()-3).get("email").trim();
		User user=userRepository.findByEmail(orderEmail);
		String sendersName= user.getScreenName();
		Long poolId=Long.parseLong(data.get(data.size()-4).get("poolId"));
		Float orderTotal=Float.parseFloat(data.get(data.size()-5).get("orderTotal"));
		List<OrderItems> orderItems=new ArrayList<OrderItems>();
		int loopcount=0;
		String msg="The following order for user "+ sendersName+" from store "+storeName+" has not been delivered as opposite to your records. "
				+ "\nPlease look into the matter. \n\n ";
		System.out.println("size of data is "+data.size()+" and it will traverse from 0 to "+ String.valueOf(data.size()-5));
		for(Map<String, String> order: data){
			if(loopcount<data.size()-5) {
				msg=msg+"\n------------------------------------\n";
				msg=msg+order.get("productName")+ " "+order.get("itemQuantity")+order.get("unit")+" for $"+order.get("totalPrice");
			}
			loopcount+=1;
		}
		msg=msg+"\n------------------------------------\n";
		msg=msg+"Order Total : $"+orderTotal;
		System.out.println("msg is "+msg);
		emailSer.mailIfUndelivered(toEmail,msg,sendersName);
		return null;
		
		
		
		
		
		
		
	}
	
	
	
	
	@CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method=RequestMethod.POST, value="/browsePool", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
	public ResponseEntity<?> browsePool(@RequestBody Map<String, String> data) {
		String incomingData=data.get("data").trim();
		ArrayList<Pool> res = new ArrayList<Pool>(); 
   
    if(incomingData.contentEquals("") || incomingData==null){
    	return ResponseEntity.accepted().body(res);
		}
    else {		
		String[] browsedata=incomingData.split("\\s+");;		
		HashSet<Pool> allPools=new HashSet<Pool>();
		for(String s: browsedata) {
			System.out.println("String is "+s);
			List<Pool> poolsAddress = poolRepository.findByNameOrAddressStreetOrAddressCityOrAddressStateOrAddressZip(s,s,s,s,s);
			allPools.addAll(poolsAddress);
		}
		if(allPools.size()==0) {
			return ResponseEntity.accepted().body(res);
		}
		return ResponseEntity.accepted().body(allPools);
    }
		
	}
	
	@CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method=RequestMethod.POST, value="/joinPool", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
	public ResponseEntity<?> joinPool(@RequestBody Map<String, String> data) {
		String email=data.get("email").trim();
		String poolName=data.get("poolName").trim();
		String referenceName=data.get("referenceName").trim();
		Map<String,Object> response = new HashMap<String, Object>();
		User tempUser= userServiceImpl.getUser(email);
		if (tempUser.getPool()==null) {
			Pool tempPool = poolServiceImpl.getPoolData(poolName);
			if (tempPool != null) {
				User tempReference= userServiceImpl.findUser(referenceName);
				if (tempReference != null && tempReference.getPool().getPoolId()==tempPool.getPoolId()) {
					String position;
					if(tempPool.getPoolLeader().equalsIgnoreCase(tempReference.getNickname())) {
						position="poolLeader";
					}
					else {
						position="pooler";
					}					
						String poolCode = String.valueOf(new Random(System.nanoTime()).nextInt(100000));
						tempUser.setPoolCode(poolCode);
						tempUser = userRepository.save(tempUser);
						String userNickName=tempUser.getNickname();
						String reference= tempReference.getNickname();
						String toEmail=tempReference.getEmail();
						emailSer.sendEmail(poolCode,userNickName,poolName,reference,position,toEmail);					
					
					return ResponseEntity.accepted().body("Your request has been sent!");
				}
				else {
					
					
					return ResponseEntity.accepted().body("Reference Name does not exist!");
				}
			}
			else {
				
				response.put("error", "Pool Name does not exist!");
				return ResponseEntity.badRequest().body(response);
			}
		}
		else {
			response.put("error", "User is already associated with a pool!");
			return ResponseEntity.badRequest().body(response);
		}
		
		
		
	}
	
	@CrossOrigin(origins = {"http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method=RequestMethod.POST, value="/sendMessage", headers = "Accept=application/json",produces = { "application/json", "application/xml" })
	public ResponseEntity<?> sendMessage(@RequestBody Map<String, String> data){
		String senderEmail=data.get("senderEmail").trim();
		String receiverScreenName=data.get("receiverNickname").trim();
		String message=data.get("message").trim();
		System.out.println("senderEmail "+ senderEmail+" receiverScreenName "+receiverScreenName+" message "+message);
		if(message.contentEquals("") || message==null) {
			 return ResponseEntity.accepted().body("No message provided");
		 }
		else {
			User user=userRepository.findByScreenName(receiverScreenName);
			String receiverEmail=user.getEmail();
			User user1=userRepository.findByEmail(senderEmail);
			String senderName=user1.getScreenName();
			emailSer.sendMessageToPooler(senderEmail,senderName,receiverEmail,message);
			return ResponseEntity.accepted().body("Message has been sent");
		}
		
		
		
	}
	
	@GetMapping(value="/verify")
	@CrossOrigin(origins = { "http://3.93.9.166:8080","http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	public ResponseEntity<?> verify(@RequestParam("pool") String poolName, 
			@RequestParam("code") String poolCode, 
			@RequestParam("user") String userNickName, 
			@RequestParam("reference") String reference,
			@RequestParam("position") String position,
			@RequestParam("toEmail") String toEmail){
		Map<String,Object> response = new HashMap<String, Object>();
		User user=userRepository.findByNickname(userNickName);
		User refered=userRepository.findByNickname(reference);
		if(user.getPoolCode().equals(poolCode)){
			if(position.equals("poolLeader")) {
				user.setReference(reference);;
				user.setPool(refered.getPool());
				userRepository.save(user);
				response.put("ok", "User added to the pool!!");
				return ResponseEntity.accepted().body(response);
			}
			else {
				Pool pool=poolRepository.findPool(poolName);
				String poolLeader= pool.getPoolLeader();
				String poolLeaderEmail=userRepository.findByNickname(poolLeader).getEmail();
				emailSer.sendEmail(poolCode,userNickName,poolName,reference,"poolLeader",poolLeaderEmail);
				response.put("ok", "mail sent to the pool leader");
				return ResponseEntity.accepted().body(response);
			}
			
			
		} else {
			response.put("error", "user cannot be added to the pool!");
			return ResponseEntity.badRequest().body(response);
			
		}
		
		   
		
		
	}	

}
