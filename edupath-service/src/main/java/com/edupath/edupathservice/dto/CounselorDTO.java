package com.edupath.edupathservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounselorDTO {
    private Long id;
    private String counselorId;
    private String fullName;
    private String qualification;
    private String specialization;
    private Integer experience;
    private String status;
    private String officeLocation;
    private String address;
    private String phoneNumber;
    private String email;
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
