package com.example.backend.serviceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.models.*;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;

@Service
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserRepository userRepository;


	public User saveUser(User user){
		if(user!=null){
			return userRepository.save(user);
		}else{
			return null;
		}

	}

	public User getUser(String email) {
		if(email != null)
			return userRepository.findByEmail(email);
		else
			return null;
	}

	public User findUserByNickName(String NickName) {
		if(NickName != null)
			return userRepository.findByNickname(NickName);
		else
			return null;
	}

	public User findUser(String ScreenName) {
		if(ScreenName != null)
			return userRepository.findByScreenName(ScreenName);
		else
			return null;
	}

}
