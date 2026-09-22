package com.edupath.edupathservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_marks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String marks;

    private LocalDate date;

    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    public void syncFields() {
        if (this.date == null) {
            this.date = LocalDate.now();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
