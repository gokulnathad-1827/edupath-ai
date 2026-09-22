package com.edupath.edupathservice.controller;

import com.edupath.edupathservice.dto.CounselorDTO;
import com.edupath.edupathservice.service.CounselorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.edupath.edupathservice.dto.CounselorReportDTO;

@RestController
@RequestMapping("/api/counselors")
@RequiredArgsConstructor
public class CounselorController {

    private final CounselorService counselorService;

    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<CounselorDTO> createCounselor(@RequestBody CounselorDTO dto) {
        return new ResponseEntity<>(counselorService.createCounselor(dto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<CounselorDTO>> getAllCounselors() {
        return ResponseEntity.ok(counselorService.getAllCounselors());
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<CounselorDTO> getCounselorById(@PathVariable Long id) {
        return ResponseEntity.ok(counselorService.getCounselorById(id));
    }

    @GetMapping("/{id}/report")
    @PreAuthorize("permitAll()")
    public ResponseEntity<CounselorReportDTO> getCounselorReport(@PathVariable Long id) {
        return ResponseEntity.ok(counselorService.getCounselorReport(id));
    }

    @GetMapping("/{id}/students")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<com.edupath.edupathservice.dto.StudentDTO>> getAssignedStudentsForCounselor(@PathVariable Long id) {
        return ResponseEntity.ok(counselorService.getAssignedStudentsForCounselor(id));
    }

    @GetMapping("/user/{identifier}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<CounselorDTO> getCounselorByIdentifier(@PathVariable String identifier) {
        return ResponseEntity.ok(counselorService.findCounselorByIdentifier(identifier));
    }

    @GetMapping("/user/{identifier}/report")
    @PreAuthorize("permitAll()")
    public ResponseEntity<CounselorReportDTO> getCounselorReportByIdentifier(@PathVariable String identifier) {
        CounselorDTO counselor = counselorService.findCounselorByIdentifier(identifier);
        return ResponseEntity.ok(counselorService.getCounselorReport(counselor.getId()));
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<CounselorDTO> getCounselorByEmail(@PathVariable String email) {
        return ResponseEntity.ok(counselorService.getCounselorByEmail(email));
    }

    @PutMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<CounselorDTO> updateCounselor(@PathVariable Long id, @RequestBody CounselorDTO dto) {
        return ResponseEntity.ok(counselorService.updateCounselor(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Map<String, String>> deleteCounselor(@PathVariable Long id) {
        counselorService.deleteCounselor(id);
        return ResponseEntity.ok(Map.of("message", "Counselor deleted successfully"));
    }
}
