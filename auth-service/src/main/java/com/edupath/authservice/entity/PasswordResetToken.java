package com.edupath.authservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "password_reset_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {
    @Id
    private String id;

    @Indexed(unique = true)
    private String token;

    private String userEmail;

    private LocalDateTime expiryDate;

    private boolean used;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}
