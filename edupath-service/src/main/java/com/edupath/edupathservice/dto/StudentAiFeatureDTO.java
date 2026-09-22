package com.edupath.edupathservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAiFeatureDTO {

    private Integer age;
    private String gender;
    private Integer grade;

    @JsonProperty("attendance_percentage")
    private Double attendancePercentage;

    @JsonProperty("previous_percentage")
    private Double previousPercentage;

    @JsonProperty("current_percentage")
    private Double currentPercentage;

    @JsonProperty("mathematics_score")
    private Double mathematicsScore;

    @JsonProperty("science_score")
    private Double scienceScore;

    @JsonProperty("english_score")
    private Double englishScore;

    @JsonProperty("computer_score")
    private Double computerScore;

    @JsonProperty("assignment_completion_rate")
    private Double assignmentCompletionRate;

    @JsonProperty("study_hours_per_day")
    private Double studyHoursPerDay;

    @JsonProperty("behavior_score")
    private Double behaviorScore;

    @JsonProperty("parental_support")
    private String parentalSupport;

    @JsonProperty("previous_failures")
    private Integer previousFailures;

    @JsonProperty("academic_trend")
    private String academicTrend;
}
