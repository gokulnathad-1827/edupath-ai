package com.edupath.edupathservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherDTO {
    private Long id;
    private String employeeId;
    private String name;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String subject;
    private String specialization;
    private String department;
    private String qualification;
    private Integer experience;
    private String status;
    private Object userId;

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
