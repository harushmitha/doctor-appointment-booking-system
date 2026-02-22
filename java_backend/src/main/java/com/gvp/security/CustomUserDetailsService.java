package com.gvp.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.gvp.repository.UserRepository;

@Service
	public class CustomUserDetailsService implements UserDetailsService {

	    @Autowired
	    private UserRepository repo;

	    @Override
	    public UserDetails loadUserByUsername(String username)
	            throws UsernameNotFoundException {

	        com.gvp.entity.User user = repo.findByUsername(username);

	        if (user == null)
	            throw new UsernameNotFoundException("User not found");

	        return new org.springframework.security.core.userdetails.User(
	                user.getUsername(),
	                user.getPassword(),
	                List.of(new SimpleGrantedAuthority(user.getRole()))
	        );
	    }
	}



