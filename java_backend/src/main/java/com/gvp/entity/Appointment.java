package com.gvp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
	@Data
	public class Appointment {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String patientName;
	    private String date;

	    @ManyToOne
	    @JoinColumn(name="doctor_id")
	    private Doctor doctor;

		public Appointment() {
			super();
			// TODO Auto-generated constructor stub
		}

		public Appointment(Long id, String patientName, String date, Doctor doctor) {
			super();
			this.id = id;
			this.patientName = patientName;
			this.date = date;
			this.doctor = doctor;
		}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getPatientName() {
			return patientName;
		}

		public void setPatientName(String patientName) {
			this.patientName = patientName;
		}

		public String getDate() {
			return date;
		}

		public void setDate(String date) {
			this.date = date;
		}

		public Doctor getDoctor() {
			return doctor;
		}

		public void setDoctor(Doctor doctor) {
			this.doctor = doctor;
		}

		@Override
		public String toString() {
			return "Appointment [id=" + id + ", patientName=" + patientName + ", date=" + date + ", doctor=" + doctor
					+ "]";
		}
	    
	}



