package com.edupath.edupathservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String parentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String fullName;

    private String fatherName;

    private String motherName;

    private String guardianName;

    private String occupation;

    private String childName;

    private String email;

    private String phoneNumber;

    private String address;

    private String relationship;

    private String status;
}
