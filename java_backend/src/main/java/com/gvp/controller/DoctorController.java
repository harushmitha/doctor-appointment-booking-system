package com.gvp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gvp.entity.Doctor;
import com.gvp.repository.DoctorRepository;

@RestController
	@RequestMapping("/api/doctors")
	@CrossOrigin
	public class DoctorController {

	    @Autowired
	    private DoctorRepository repo;

	    @PostMapping
	    public Doctor addDoctor(@RequestBody Doctor doctor) {
	        return repo.save(doctor);
	    }

	    @GetMapping
	    public List<Doctor> getAll() {
	        return repo.findAll();
	    }
	}


