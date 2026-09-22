package com.edupath.edupathservice.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDTO {
    private Long id;
    private String studentId;
    private String admissionNumber;
    private String rollNumber;
    private String fullName;
    private String gender;
    private LocalDate dateOfBirth;
    private String className;
    private String section;
    private String academicYear;
    private String bloodGroup;
    private String address;
    private String phoneNumber;
    private String parentPhone;
    private String email;
    private String status;
    private Object userId;
    private Long classTeacherId;
    private String classTeacherName;
    private Long parentId;
    private String parentName;
    private Long counselorId;
    private String counselorName;

    public Long getNumericUserId() {
        if (userId instanceof Number) {
            return ((Number) userId).longValue();
        } else if (userId instanceof String) {
            try {
                return Long.parseLong((String) userId);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }
}
