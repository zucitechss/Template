package org.example.utilities;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;

public class TokenUtil {

    private static final String SECRET_KEY = "a_very_long_secret_key_that_is_at_least_32_characters";

    public static String generateLoanIdToken(Long loanId) {
        return Jwts.builder()
                .setSubject(String.valueOf(loanId))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())  // use bytes for key
                .compact();
    }

    public static Long decodeLoanIdToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY.getBytes())  // use bytes for key
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }
}


