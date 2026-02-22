package com.gvp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gvp.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}

