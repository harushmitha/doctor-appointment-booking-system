package com.gvp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gvp.entity.User;
import com.gvp.repository.UserRepository;
import com.gvp.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return repo.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        try {
            if (request.getUsername() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body("Invalid Credentials");
            }

            User user = repo.findByUsername(request.getUsername());

            if (user != null && user.getPassword().equals(request.getPassword())) {
                System.out.println("User found: " + user.getUsername());
                System.out.println("User role: " + user.getRole());
                
                String role = user.getRole();
                if (role == null || role.isEmpty()) {
                    role = "PATIENT"; // Default role if null
                    System.out.println("Role was null, setting to PATIENT");
                }
                
                String token = jwtUtil.generateToken(user.getUsername(), role);
                System.out.println("Generated token with role: " + role);
                return ResponseEntity.ok(token);
            }

            return ResponseEntity.status(401).body("Invalid Credentials");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            
            User user = repo.findByUsername(username);
            if (user != null) {
                // Return user info without password
                User userInfo = new User();
                userInfo.setId(user.getId());
                userInfo.setUsername(user.getUsername());
                userInfo.setRole(user.getRole());
                return ResponseEntity.ok(userInfo);
            }

            return ResponseEntity.status(404).body("User not found");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
