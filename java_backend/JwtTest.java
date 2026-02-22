import java.util.Date;
import java.util.Base64;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtTest {
    private static String secret = "mysecretkeymysecretkeymysecretkey";

    public static void main(String[] args) {
        System.out.println("Testing JWT Token Generation...");
        
        // Test 1: Generate token with role
        String token = generateTokenWithRole("testuser", "ADMIN");
        System.out.println("Generated Token: " + token);
        
        // Test 2: Decode and print payload
        String[] parts = token.split("\\.");
        if (parts.length >= 2) {
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            System.out.println("Decoded Payload: " + payload);
        }
        
        // Test 3: Generate token without role (old method)
        String tokenWithoutRole = generateTokenWithoutRole("testuser");
        System.out.println("\nToken without role: " + tokenWithoutRole);
        
        String[] parts2 = tokenWithoutRole.split("\\.");
        if (parts2.length >= 2) {
            String payload2 = new String(Base64.getUrlDecoder().decode(parts2[1]));
            System.out.println("Decoded Payload (no role): " + payload2);
        }
    }
    
    public static String generateTokenWithRole(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
    }
    
    public static String generateTokenWithoutRole(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
    }
}