package com.edupath.edupathservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounselingSessionDTO {

    private Long id;
    private String student;
    private String studentName;
    private String classSection;
    private String date;
    private String sessionDate;
    private String time;
    private String sessionTime;
    private String issue;
    private String status;
    private String notes;
    private String counselorName;
    private String badgeType;
}
