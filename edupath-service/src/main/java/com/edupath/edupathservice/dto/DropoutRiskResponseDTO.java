package com.edupath.edupathservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DropoutRiskResponseDTO {

    private Long studentId;
    private String studentName;

    @JsonProperty("dropout_risk")
    private String dropoutRisk;

    private Double confidence;

    private StudentAiFeatureDTO featureSummary;
}
