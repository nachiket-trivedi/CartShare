package com.example.backend.serviceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.models.Pool;
import com.example.backend.repository.PoolRepository;
import com.example.backend.service.PoolService;

@Service
public class PoolServiceImpl implements PoolService{
	
	@Autowired
	private PoolRepository poolRepository;
	
	public Pool getPool(String name) {
		if(name != null)
			return poolRepository.findByName(name).get(0);
		
		else
			return null;
	}
	
	public Pool poolUpdate(String newId) {
		if(newId != null)
			return poolRepository.findByNewId(newId).get(0);
		
		else
			return null;
	}
	
	public Pool getPoolData(String name) {
		if(name != null)
			return poolRepository.findPool(name);
		
		else
			return null;
	}
	
	public void deletePool(Long poolId) {
		poolRepository.deleteById(poolId);
	}

}
