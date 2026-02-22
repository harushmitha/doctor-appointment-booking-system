package com.gvp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
	@Data
	public class Doctor {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String name;
	    private String specialization;
		public Doctor() {
			super();
			// TODO Auto-generated constructor stub
		}
		public Doctor(Long id, String name, String specialization) {
			super();
			this.id = id;
			this.name = name;
			this.specialization = specialization;
		}
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getSpecialization() {
			return specialization;
		}
		public void setSpecialization(String specialization) {
			this.specialization = specialization;
		}
		@Override
		public String toString() {
			return "Doctor [id=" + id + ", name=" + name + ", specialization=" + specialization + "]";
		}
	    
	}



