package com.edupath.edupathservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "counselors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Counselor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String counselorId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String qualification;

    private String specialization;

    private Integer experience;

    private LocalDate joiningDate;

    private String status;

    private String officeLocation;

    private String phoneNumber;

    private String email;
}
