package com.edupath.edupathservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "teacher_id")
    private Long teacherId;

    @Column(nullable = false)
    private String status;

    private String subject;

    private LocalDate date;

    @Column(name = "attendance_date")
    private LocalDate attendanceDate;

    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    public void syncFields() {
        if (this.date == null && this.attendanceDate != null) {
            this.date = this.attendanceDate;
        } else if (this.attendanceDate == null && this.date != null) {
            this.attendanceDate = this.date;
        } else if (this.date == null && this.attendanceDate == null) {
            this.date = LocalDate.now();
            this.attendanceDate = LocalDate.now();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
