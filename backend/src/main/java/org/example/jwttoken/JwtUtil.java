package org.example.jwttoken;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct; // Use this import for JDK 9+
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.util.*;

@Component
public class JwtUtil {

    @Value("${jwt.secret:}") // Empty string if not set
    private String secret;

    @Value("${jwt.expiration:86400000}") // default to 1 day
    private long expirationTime;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        if (secret == null || secret.isBlank()) {
            System.out.println("[JwtUtil] No JWT secret provided. Generating one automatically...");
            try {
                KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA512");
                SecretKey generatedKey = keyGen.generateKey();
                String base64Key = Base64.getEncoder().encodeToString(generatedKey.getEncoded());
                this.secretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(base64Key));

                System.out.println("[JwtUtil] Generated secret key (Base64): " + base64Key);
                System.out.println("[JwtUtil] ⚠️ WARNING: This key is only valid for this runtime session.");
            } catch (Exception e) {
                throw new RuntimeException("Failed to generate JWT secret key", e);
            }
        } else {
            byte[] decodedKey = Base64.getDecoder().decode(secret);
            this.secretKey = Keys.hmacShaKeyFor(decodedKey);
        }
    }

    public String generateToken(String username, Set<String> roles, Set<String> permissions) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .claim("permissions", permissions)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }



    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Set<String> extractRoles(String token) {
        return new HashSet<>(Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("roles", List.class));
    }

    public Set<String> extractPermissions(String token) {
        return new HashSet<>(Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("permissions", List.class));
    }



    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
