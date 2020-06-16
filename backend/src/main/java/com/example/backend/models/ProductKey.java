package com.example.backend.models;
import java.io.Serializable;
import javax.persistence.Embeddable;

@Embeddable
public class ProductKey implements Serializable {
	
	private long storeId;
	private long sku;
	
	public ProductKey() {
		
	}

	public ProductKey(long store_id, long sku) {
		super();
		this.storeId = store_id;
		this.sku = sku;
	}

	public ProductKey(Long sku) {
        this.sku = sku;
    }
	public long getStore_id() {
		return storeId;
	}

	


	public void setStore_id(long store_id) {
		this.storeId = store_id;
	}

	public long getSku() {
		return sku;
	}

	public void setSku(long sku) {
		this.sku = sku;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + (int) (sku ^ (sku >>> 32));
		result = prime * result + (int) (storeId ^ (storeId >>> 32));
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ProductKey other = (ProductKey) obj;
		if (sku != other.sku)
			return false;
		if (storeId != other.storeId)
			return false;
		return true;
	}
	
	
	
	

}
