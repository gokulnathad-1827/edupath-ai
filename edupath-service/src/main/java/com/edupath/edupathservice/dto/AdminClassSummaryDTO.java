package com.edupath.edupathservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminClassSummaryDTO {
    private String id;
    private String name;
    private String department;
    private String teacherName;
    private Integer strength;
}
