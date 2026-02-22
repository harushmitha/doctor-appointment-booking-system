package com.gvp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gvp.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

}
