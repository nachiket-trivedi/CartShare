package com.example.backend.repository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;
import com.example.backend.models.User;

@Repository
public interface UserRepository extends CrudRepository<User, Long>{

User findByEmail(String email);
User findByScreenName(String ScreenName);
User findByNickname( String userNickName);
User save(User user);

}

