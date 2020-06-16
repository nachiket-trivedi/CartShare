package com.example.backend.models;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;
import javax.validation.constraints.NotNull;




@Entity
@Table(name = "user")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler","poolOrders"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="User_ID")
    private long userId;
	@Column(unique=true)
    private String email;
	@Column(unique=true)
    private String screenName;
	@Column(unique=true)
    private String nickname;
    private String password;
    private String phoneNumber;
    @NotNull
    private String userType; //admin or pooler
    @Column(columnDefinition="BOOLEAN DEFAULT false")
    private boolean verified;
    @ManyToOne(fetch=FetchType.EAGER,optional=true)
    @JoinColumn(name="pool_id", nullable=true)
    @JsonIgnoreProperties({"members"})
    private Pool pool;
    private String poolCode;
    private String verifyCode;
    @Column(columnDefinition = "integer default 0")
    private int credits;
    private String reference;
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "user",cascade = CascadeType.ALL,orphanRemoval= true)
	@JsonIgnoreProperties({"user"})
	private List<Order> poolOrders;
    @Embedded
    private Address address;
    
    
    public User() {
    	
    }


	public User(long userId, String email, String screenName, String nickname, String password,String poolCode,
			String phoneNumber,@NotNull String userType, boolean verified, Pool pool, int credits, String reference,
			List<Order> poolOrders, Address address,String verifyCode) {
		super();
		this.userId = userId;
		this.email = email;
		this.screenName = screenName;
		this.nickname = nickname;
		this.password = password;
		this.phoneNumber=phoneNumber;
		this.userType = userType;
		this.verified = verified;
		this.pool = pool;
		this.credits = credits;
		this.reference = reference;
		this.poolOrders = poolOrders;
		this.address = address;
		this.poolCode=poolCode;
		this.verifyCode=verifyCode;
	}


	public long getUserId() {
		return userId;
	}


	public void setUserId(long userId) {
		this.userId = userId;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	
	public String getScreenName() {
		return screenName;
	}


	public void setScreenName(String screenName) {
		this.screenName = screenName;
	}


	public String getNickname() {
		return nickname;
	}


	public void setNickname(String nickname) {
		this.nickname = nickname;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getUserType() {
		return userType;
	}


	public void setUserType(String userType) {
		this.userType = userType;
	}


	public boolean isVerified() {
		return verified;
	}


	public void setVerified(boolean verified) {
		this.verified = verified;
	}


	public Pool getPool() {
		return pool;
	}


	public void setPool(Pool pool) {
		this.pool = pool;
	}


	public int getCredits() {
		return credits;
	}


	public void setCredits(int credits) {
		this.credits = credits;
	}


	public String getReference() {
		return reference;
	}


	public void setReference(String reference) {
		this.reference = reference;
	}


	public List<Order> getPoolOrders() {
		return poolOrders;
	}


	public void setPoolOrders(List<Order> poolOrders) {
		this.poolOrders = poolOrders;
	}


	public Address getAddress() {
		return address;
	}


	public void setAddress(Address address) {
		this.address = address;
	}


	public String getPhoneNumber() {
		return phoneNumber;
	}


	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}


	public String getPoolCode() {
		return poolCode;
	}


	public void setPoolCode(String poolCode) {
		this.poolCode = poolCode;
	}

	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}
	
    
    
    
    
    
    



}
