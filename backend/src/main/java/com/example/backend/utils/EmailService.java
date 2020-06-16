package com.example.backend.utils;

import com.example.backend.models.Store;
import com.example.backend.repository.StoreRepository;
import com.sendgrid.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.util.List;

@Configuration
public class EmailService {

	private String fromEmail = "mailcartshare@gmail.com";

	private String key = "";
	@Autowired
	private StoreRepository storeRepository;

	@Bean
	public EmailService emailSer() {
		return new EmailService();
	}

	public boolean sendEmail(String poolCode, String userNickName, String poolName, String reference, String position,
			String toEmail) {
		Email from = new Email(fromEmail);
		String subject = "Pool Join Request from CartPool";
		Email to = new Email(toEmail);

		// update it with front end email
		Content content = new Content("text/plain",
				"Hey There! CartPool pooler " + userNickName + " has requested to join pool " + poolName
						+ " and given the reference of " + reference
						+ ". If you want to accept the request, Please click on this link : "
						+ "http://3.93.9.166:8080/verify?pool=" + poolName + "&code=" + poolCode + "&user="
						+ userNickName + "&reference=" + reference + "&position=" + position + "&toEmail=" + toEmail);
		Mail mail = new Mail(from, subject, to, content);
		SendGrid sg = new SendGrid(key);
		Request request = new Request();
		try {
			request.setMethod(Method.POST);
			request.setEndpoint("mail/send");
			request.setBody(mail.build());
			Response response = sg.api(request);
		} catch (IOException ex) {
			// System.out.println(ex.getMessage());
			return false;
		}

		return true;
	}

	
	public boolean sendMessageToPooler(String senderEmail,String sendername,String receiverEmail, String message) {
		Email from = new Email(fromEmail);
		String subject = "Message from "+sendername+ " from CartShare";
		Email to = new Email(receiverEmail);
String msg="Hey There!"+"\n"+"CartPool pooler "+ sendername+" has messaged you.\n The message is :\n "+message;
		// update it with front end email
		Content content = new Content("text/plain",
				msg);
		Mail mail = new Mail(from, subject, to, content);
		SendGrid sg = new SendGrid(key);
		Request request = new Request();
		try {
			request.setMethod(Method.POST);
			request.setEndpoint("mail/send");
			request.setBody(mail.build());
			Response response = sg.api(request);
		} catch (IOException ex) {
			// System.out.println(ex.getMessage());
			return false;
		}

		return true;
	}
	
	public boolean mailIfUndelivered(String toEmail,String msg,String sendersName) {
		Email from = new Email(fromEmail);
		String subject = "Delivery for  "+sendersName+ " did not happen";
		Email to = new Email(toEmail);

		Content content = new Content("text/plain",
				msg);
		Mail mail = new Mail(from, subject, to, content);
		SendGrid sg = new SendGrid(key);
		Request request = new Request();
		try {
			request.setMethod(Method.POST);
			request.setEndpoint("mail/send");
			request.setBody(mail.build());
			Response response = sg.api(request);
		} catch (IOException ex) {
			// System.out.println(ex.getMessage());
			return false;
		}

		return true;
	}
	
	
	public boolean sendVerifyEmail(String code, String email) {
		Email from = new Email(fromEmail);
		String subject = "Verification Email from CartShare";
		Email to = new Email(email);

		// update it with front end email
		Content content = new Content("text/plain",
				"Please click on this link : " + "http://3.93.9.166:8080/verifyEmail?code=" + code + "&email=" + email);
		Mail mail = new Mail(from, subject, to, content);

		SendGrid sg = new SendGrid(key);
		Request request = new Request();
		try {
			request.setMethod(Method.POST);
			request.setEndpoint("mail/send");
			request.setBody(mail.build());
			Response response = sg.api(request);
		} catch (IOException ex) {
			System.out.println(ex.getMessage());
			return false;
		}

		return true;
	}

	public boolean orderPickupEmail(String senderEmail, Long storeId, String storeName) {

		// System.out.println("details are as follows: sender email is "+senderEmail);
		// System.out.println("storeid "+storeId);
		// System.out.println("storename "+storeName);
		Email from = new Email(fromEmail);
		String subject = "Order pickup by Cartpool";
		Email to = new Email(senderEmail);
		Content content = new Content("text/plain", "Hello There! Your order from store " + storeName
				+ " has been picked up and will be delivered to you soon.");
		Mail mail = new Mail(from, subject, to, content);
		SendGrid sg = new SendGrid(key);
		Request request = new Request();
		try {
			request.setMethod(Method.POST);
			request.setEndpoint("mail/send");
			request.setBody(mail.build());
			Response response = sg.api(request);
		} catch (IOException ex) {
			// System.out.println(ex.getMessage());
			return false;
		}
		return true;
	}

	public boolean pickupDetailsEmail(String deliveryPoolerEmail, List<String> ordersInfo) {

		// System.out.println("details are as follows: sender email is "+senderEmail);
		// System.out.println("storeid "+storeId);
		// System.out.println("storename "+storeName);
		Email from = new Email(fromEmail);
		String subject = "Delivery details by Cartpool";
		Email to = new Email(deliveryPoolerEmail);
		String details = "";
		for (String info : ordersInfo) {
			details = details + "\n " + info;
		}
		System.out.println("details are " + details);
		Content content = new Content("text/plain", details);
		Mail mail = new Mail(from, subject, to, content);
		SendGrid sg = new SendGrid(key);
		Request request = new Request();
		try {
			request.setMethod(Method.POST);
			request.setEndpoint("mail/send");
			request.setBody(mail.build());
			Response response = sg.api(request);
		} catch (IOException ex) {
			// System.out.println(ex.getMessage());
			return false;
		}
		return true;
	}

	public boolean orderDeliveryEmail(String senderEmail, String storeName) {

		System.out.println("details are as follows: sender email is " + senderEmail);
		// System.out.println("storeid "+storeId);
		System.out.println("storename " + storeName);
		Email from = new Email(fromEmail);
		String subject = "Order delivery by Cartpool";
		Email to = new Email(senderEmail);
		Content content = new Content("text/plain", "Hello There! Your order from store " + storeName
				+ " has been Delivered. Report on the portal if not delivered yet.  ");
		Mail mail = new Mail(from, subject, to, content);
		SendGrid sg = new SendGrid(key);
		Request request = new Request();
		try {
			request.setMethod(Method.POST);
			request.setEndpoint("mail/send");
			request.setBody(mail.build());
			Response response = sg.api(request);
		} catch (IOException ex) {
			// System.out.println(ex.getMessage());
			return false;
		}
		return true;
	}
	
	public boolean readyToPickupEmail(String deliveryPoolerEmail, List<String> ordersInfo) {  //this one goes to the person who will pickup the order

		System.out.println("details are as follows: sender email is " + deliveryPoolerEmail);
		// System.out.println("storeid "+storeId);
		//System.out.println("storename " + storeName);
		Email from = new Email(fromEmail);
		String subject = "Your CartShare Orders are Ready to Pickup!";
		Email to = new Email(deliveryPoolerEmail);
		String details = "";
		for (String info : ordersInfo) {
			details = details + "\n " + info;
		}
		
		Content content = new Content("text/plain", details);
		
		Mail mail = new Mail(from, subject, to, content);
		SendGrid sg = new SendGrid(key);
		Request request = new Request();
		try {
			request.setMethod(Method.POST);
			request.setEndpoint("mail/send");
			request.setBody(mail.build());
			Response response = sg.api(request);
		} catch (IOException ex) {
			
			return false;
		}
		return true;
	}
	
	public boolean readyToPickupEmailToFellowPoolers(String fellowPoolerEmail,long store_id) {

		
		System.out.println("details are as follows: sender email is " + fellowPoolerEmail);
		// System.out.println("storeid "+storeId);
		//System.out.println("storename " + storeName);
		Email from = new Email(fromEmail);
		String subject = "Your CartShare Orders Will be delivered by your fellow pooler!";
		Email to = new Email(fellowPoolerEmail);
		Store store = storeRepository.findStore(store_id);
		String details = "Your order at Store "+store.getName() +" will be picked by your fellow pooler.";
		
		Content content = new Content("text/plain", details);
		
		Mail mail = new Mail(from, subject, to, content);
		SendGrid sg = new SendGrid(key);
		Request request = new Request();
		try {
			request.setMethod(Method.POST);
			request.setEndpoint("mail/send");
			request.setBody(mail.build());
			Response response = sg.api(request);
		} catch (IOException ex) {
			
			return false;
		}
		return true;
	}
	
}
