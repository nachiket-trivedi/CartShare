package com.example.backend.controller;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Random;

import com.example.backend.models.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.serviceImpl.UserServiceImpl;
import com.example.backend.utils.EmailService;

import javax.validation.constraints.NotNull;

@RestController
public class UserController {

	@Autowired
	private UserServiceImpl userServiceImpl;


	@Autowired
	private EmailService emailSer;

	@CrossOrigin(origins = {"http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = RequestMethod.POST, value = "/userStatus", headers = "Accept=application/json", produces = {"application/json", "application/xml"})
	public ResponseEntity<?> userStatus(@RequestBody Map<String, String> data) {
		String email = data.get("email").trim();
		User tempUser = userServiceImpl.getUser(email);
		if (tempUser.getPool() == null) {
			return ResponseEntity.accepted().body("can join");
		} else {
			return ResponseEntity.accepted().body("cannot join");
		}
	}

	@CrossOrigin(origins = {"http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = {RequestMethod.POST, RequestMethod.GET}, value = "/login", headers = "Accept=application/json", produces = {"application/json", "application/xml"})
	public ResponseEntity<?> login(@RequestBody Map<String, String> data) {

		Map<String, Object> response = new HashMap<String, Object>();
		System.out.println(data);
		try {
			String email = data.get("email").trim();
			String gAuth = data.get("gAuth").trim();
			System.out.println(email + " ==========");
			System.out.println(gAuth + " gauth ==========");

			if (email == null) {
				response.put("error", "Invalid Email");
				return ResponseEntity.badRequest().body(response);
			}
			System.out.println("I am here");
			User tempUser = userServiceImpl.getUser(email);

			if (tempUser == null) {
				if (gAuth.equals("false")) {
					response.put("error", "User not found!");
				} else {
					User newUser = new User();
					String[] s = email.split("@");
					if (s[1].equals("sjsu.edu")) {
						newUser.setUserType("Admin");
					} else {
						newUser.setUserType("Pooler");
					}
					newUser.setScreenName(s[0]);
					newUser.setNickname(s[0]);
					newUser.setEmail(email);
					newUser.setPassword("");
					String code = String.valueOf(new Random(System.nanoTime()).nextInt(100000));
					newUser.setVerifyCode(code);

					emailSer.sendVerifyEmail(code, email);

					System.out.println("User So far: " + newUser);
					newUser = userServiceImpl.saveUser(newUser);
					return ResponseEntity.ok(newUser);
				}
			} else {
				System.out.println(tempUser+" ==========");
				User newUser = new User();
				newUser.setEmail(tempUser.getEmail());
				newUser.setAddress(tempUser.getAddress());
				newUser.setNickname(tempUser.getNickname());
				newUser.setUserId(tempUser.getUserId());
				newUser.setPhoneNumber(tempUser.getPhoneNumber());
				newUser.setVerified(tempUser.isVerified());
				newUser.setUserType(tempUser.getUserType());
				newUser.setScreenName(tempUser.getScreenName());

				if (tempUser.getPassword().equals(data.get("password").trim()) || gAuth.equals("true")) {
					return ResponseEntity.ok(newUser);
				} else {
					response.put("error", "Invalid Credentials");
				}
			}
			return ResponseEntity.badRequest().body(response);
		} catch (Exception e) {
			response.put("error", "Insufficient Information");
			return ResponseEntity.badRequest().body(response);
		}
	}

	@CrossOrigin(origins = {"http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = {RequestMethod.POST, RequestMethod.GET}, value = "/signup", headers = "Accept=application/json", produces = {"application/json", "application/xml"})
	public ResponseEntity<?> signup(@RequestBody Map<String, String> data) {
		Map<String, Object> response = new HashMap<String, Object>();
		System.out.println(data);
		try {
			String email = data.get("email").trim();
			String screenName = data.get("screenName").trim();
			String nickName = data.get("nickName").trim();
			String password = data.get("password").trim();

			//String displayPic=data.get("displayImage").trim();
			String gAuth = data.get("gAuth").trim();
			System.out.println("Holaaaa");
			User oldUser = userServiceImpl.getUser(email);
			User newUser = new User();

			if (oldUser != null && !email.equals("")) {
				if (gAuth.equals("true")) {
					//Allow Login
					String[] s = email.split("@");
					if (s[1].equals("sjsu.edu")) {
						oldUser.setUserType("Admin");
					} else {
						oldUser.setUserType("Pooler");
					}

					response.put("User", oldUser);
					return ResponseEntity.accepted().body(response);
				} else {
					response.put("error", "User email already exists");
					return ResponseEntity.badRequest().body(response);
				}
			} else {
				oldUser = userServiceImpl.findUser(screenName);
				if (oldUser != null && !email.equals("") && gAuth.equals("false")) {
					response.put("error", "Screen Name already exists");
					return ResponseEntity.badRequest().body(response);
				} else {
					oldUser = null;
					oldUser = userServiceImpl.findUserByNickName(nickName);
					if (oldUser != null && !email.equals("") && gAuth.equals("false")) {
						response.put("error", "Nick Name already exists");
						return ResponseEntity.badRequest().body(response);
					} else {
						if (screenName.equals("") || nickName.equals("") || email.equals("")) {
							response.put("error", "Insufficient Information");
							return ResponseEntity.badRequest().body(response);
						} else {
							String pattern = "^[a-zA-Z0-9]*$";
							if (!screenName.matches(pattern)) {
								response.put("error", "Invalid Screen Name Format");
								return ResponseEntity.badRequest().body(response);
							} else {
								newUser.setScreenName(screenName);
								newUser.setNickname(nickName);
								newUser.setEmail(email);
								newUser.setPassword(password);
								String[] s = email.split("@");
								if (s[1].equals("sjsu.edu")) {
									newUser.setUserType("Admin");
								} else {
									newUser.setUserType("Pooler");
								}
								String code = String.valueOf(new Random(System.nanoTime()).nextInt(100000));
								newUser.setVerifyCode(code);

								emailSer.sendVerifyEmail(code, email);
								System.out.println("User So far: " + newUser);
								newUser = userServiceImpl.saveUser(newUser);
								System.out.println("User Saved: " + newUser);
								//Write for verification email
								response.put("User", newUser);
								return ResponseEntity.accepted().body(response);
							}
						}

					}
				}
			}

		} catch (Exception e) {
			System.out.println(e.getCause());
			response.put("error", "Error in Saving Information");
			return ResponseEntity.badRequest().body(response);
		}
	}

	@CrossOrigin(origins = {"http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = {RequestMethod.PUT, RequestMethod.GET}, value = "/updateUser", headers = "Accept=application/json", produces = {"application/json", "application/xml"})
	public ResponseEntity<?> updateUser(@RequestBody Map<String, String> data) {
		Map<String, Object> response = new HashMap<String, Object>();
		System.out.println("Holaaaa");
		System.out.println(data);
		try {
			String email = data.get("email");
			String nickName = data.get("nickName");
			String password = data.get("password");
			String street = data.get("street");
			String city = data.get("city");
			String state = data.get("state");
			String zipcode = data.get("zipcode");

			String mobile = data.get("mobile");
			System.out.println("Holaaaahjhajhs");

			System.out.println(email);
			if (email.equals("")) {
				response.put("error", "Invalid Email!");
				return ResponseEntity.badRequest().body(response);
			}

			System.out.println(email);

			User oldUser = userServiceImpl.getUser(email.trim());
			System.out.println(oldUser);
			System.out.println("Hola again!");

			if (oldUser == null) {
				response.put("error", "User does not Exist!");
				return ResponseEntity.badRequest().body(response);
			} else {
				User oldUser2 = userServiceImpl.findUserByNickName(nickName);
				if (oldUser2 != null && !email.equals("") && !oldUser2.getEmail().equals(email)) {
					response.put("error", "Nick Name already exists");
					return ResponseEntity.badRequest().body(response);
				} else {
					if (nickName.equals("")) {
						nickName = oldUser.getNickname();
					}
					if (street.equals("")) {
						street = oldUser.getAddress().getStreet();
					}
					if (mobile.equals("")) {
						mobile = oldUser.getPhoneNumber();
					}
					if (city.equals("")) {
						city = oldUser.getAddress().getCity();
					}
					if (state.equals("")) {
						state = oldUser.getAddress().getState();
					}
					if (zipcode.equals("")) {
						zipcode = oldUser.getAddress().getZip();
					}
					if (password.equals("")) {
						password = oldUser.getPassword();
					}

					System.out.println("I managed to reach here!");
					oldUser.setScreenName(oldUser.getScreenName());
					oldUser.setNickname(nickName.trim());
					oldUser.setEmail(email.trim());
					oldUser.setPhoneNumber(mobile.trim());
					Address address = new Address();
					address.setStreet(street.trim().trim());
					address.setCity(city.trim());
					address.setState(state.trim());
					address.setZip(zipcode.trim());
					oldUser.setAddress(address);
					oldUser.setPassword(password);

					System.out.println("User So far: " + oldUser);
					oldUser = userServiceImpl.saveUser(oldUser);
					System.out.println("User Saved: " + oldUser);

					response.put("User", oldUser);
					return ResponseEntity.accepted().body(response);

				}

			}
		} catch (Exception e) {
			response.put("error", "Error in Saving Information");
			return ResponseEntity.badRequest().body(response);
		}
	}

	@CrossOrigin(origins = {"http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = {RequestMethod.GET}, value = "/getUser", headers = "Accept=application/json", produces = {"application/json", "application/xml"})
	public ResponseEntity<?> getUser(@RequestParam Map<String, String> data) {
		Map<String, Object> response = new HashMap<String, Object>();
		System.out.println(data);
		try {
			String email = data.get("email").trim();
			User oldUser = userServiceImpl.getUser(email);

			if (oldUser == null) {
				response.put("error", "User does not Exist!");
				return ResponseEntity.badRequest().body(response);
			} else {
				response.put("User", oldUser);
				return ResponseEntity.accepted().body(response);
			}
		} catch (Exception e) {
			response.put("error", "Error in Retrieving User");
			return ResponseEntity.badRequest().body(response);
		}
	}


	@CrossOrigin(origins = {"http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = RequestMethod.POST, value = "/credits")
	public ResponseEntity<?> userCredits(@RequestBody Map<String, String> data) {

		String email = data.get("email").trim();
		User user = userServiceImpl.getUser(email);
		int credits = user.getCredits();
		return ResponseEntity.accepted().body(credits);
	}


	@GetMapping(value = "/verifyEmail")
	@CrossOrigin(origins = {"http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	public ResponseEntity<?> verifyEmail(@RequestParam("email") String email, @RequestParam("code") String code) {
		System.out.println("code " + code);
		System.out.println("email " + email);
		User oldUser = userServiceImpl.getUser(email);

		if (oldUser == null) {
			System.out.println("inside verify failure 1");
			return ResponseEntity.badRequest().body("Error in Retrieving User");
		}

		if (oldUser.getVerifyCode().equals(code)) {
			oldUser.setVerified(true);

			oldUser = userServiceImpl.saveUser(oldUser);

			System.out.println("inside verify success");
			return ResponseEntity.accepted().body("Successfully verified");
		} else {
			System.out.println("inside verify failure");
			return ResponseEntity.badRequest().body("Code Invalid for User");
		}
	}
	
	@CrossOrigin(origins = {"http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = RequestMethod.POST, value = "/checkZipcode")
	public ResponseEntity<?> checkZipcode(@RequestBody Map<String, String> data) {

		String email = data.get("email").trim();
		User user = userServiceImpl.getUser(email);
		Address address = user.getAddress();
		if(address==null)
			return ResponseEntity.accepted().body("notset");
		System.out.println("address city"+address.getCity()+"address street : "+address.getStreet()+" state:"+address.getState());

		if(address==null ||address.getZip() == null || address.getZip().length()==0 || address.getCity()==null || address.getCity().length()==0
				|| address.getStreet()==null || address.getStreet().length()==0 || address.getState()==null || address.getState().length()==0) {
			return ResponseEntity.accepted().body("notset");
		}
		else {
			return ResponseEntity.accepted().body("set");
		}
	}
	
	@CrossOrigin(origins = {"http://3.93.9.166:8080", "http://3.93.9.166:3000", "http://localhost:3000", "http://localhost:8080"})
	@RequestMapping(method = RequestMethod.POST, value = "/checkUserPool")
	public ResponseEntity<?> checkUserPool(@RequestBody Map<String, String> data) {

		String email = data.get("email").trim();
		User user = userServiceImpl.getUser(email);
		
		if(user.getPool() == null) {
			return ResponseEntity.accepted().body("notset");
		}
		else {
			return ResponseEntity.accepted().body(user.getPool().getPoolId());
		}
	}

}