package com.example.backend.repository;
import com.example.backend.models.Pool;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.example.backend.models.Pool;
import com.example.backend.models.User;


@Repository
public interface PoolRepository extends CrudRepository<Pool, Long>{
	
	List<Pool> findByName(String name);
	List<Pool> findByNewId(String newId);
	List<Pool> findById(long poolId);
	@Query ("SELECT p FROM Pool p WHERE p.name= ?1")
	Pool findPool(String name);
	//Pool findByName(String name);
	void deleteByName(String name);
	@Query("SELECT p FROM Pool p WHERE p.name LIKE %?1% OR p.address.street LIKE %?2% OR p.address.city LIKE %?3% OR p.address.state LIKE %?4% OR p.address.zip LIKE %?5%")
	List<Pool> findByNameOrAddressStreetOrAddressCityOrAddressStateOrAddressZip(String name,String street, String city, String state,String zip);

	Pool findByPoolId(Long poolId);

}
