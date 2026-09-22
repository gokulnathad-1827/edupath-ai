package com.edupath.edupathservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentDTO {
    private Long id;
    private String parentId;
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
