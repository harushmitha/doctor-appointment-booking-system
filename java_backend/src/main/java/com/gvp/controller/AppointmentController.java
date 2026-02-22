package com.gvp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gvp.entity.Appointment;
import com.gvp.entity.Doctor;
import com.gvp.repository.AppointmentRepository;
import com.gvp.repository.DoctorRepository;


@RestController
	@RequestMapping("/api/appointments")
	@CrossOrigin
	public class AppointmentController {

	    @Autowired
	    private AppointmentRepository appointmentRepo;

	    @Autowired
	    private DoctorRepository doctorRepo;

	    @PostMapping("/{doctorId}")
	    public Appointment book(@PathVariable Long doctorId,
	                            @RequestBody Appointment appointment) {

	        Doctor doctor =
	            doctorRepo.findById(doctorId).orElse(null);

	        appointment.setDoctor(doctor);

	        return appointmentRepo.save(appointment);
	    }

	    @GetMapping
	    public List<Appointment> getAll() {
	        return appointmentRepo.findAll();
	    }
	}



