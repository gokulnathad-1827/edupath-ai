package com.edupath.edupathservice.controller;

import com.edupath.edupathservice.dto.ParentDTO;
import com.edupath.edupathservice.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parents")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService parentService;

    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<ParentDTO> createParent(@RequestBody ParentDTO dto) {
        return new ResponseEntity<>(parentService.createParent(dto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<ParentDTO>> getAllParents() {
        return ResponseEntity.ok(parentService.getAllParents());
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ParentDTO> getParentById(@PathVariable Long id) {
        return ResponseEntity.ok(parentService.getParentById(id));
    }

    @GetMapping("/{id}/child")
    @PreAuthorize("permitAll()")
    public ResponseEntity<com.edupath.edupathservice.dto.StudentDTO> getLinkedStudent(@PathVariable Long id) {
        return ResponseEntity.ok(parentService.getLinkedStudentForParent(id));
    }

    @GetMapping("/user/{identifier}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ParentDTO> getParentByIdentifier(@PathVariable String identifier) {
        return ResponseEntity.ok(parentService.findParentByIdentifier(identifier));
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ParentDTO> getParentByEmail(@PathVariable String email) {
        return ResponseEntity.ok(parentService.getParentByEmail(email));
    }

    @PutMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ParentDTO> updateParent(@PathVariable Long id, @RequestBody ParentDTO dto) {
        return ResponseEntity.ok(parentService.updateParent(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Map<String, String>> deleteParent(@PathVariable Long id) {
        parentService.deleteParent(id);
        return ResponseEntity.ok(Map.of("message", "Parent deleted successfully"));
    }

    // ── Parent-Child Security Enforced Endpoints ─────────────────────────
    private final com.edupath.edupathservice.service.StudentService studentService;

    @GetMapping("/{parentId}/student/{studentId}/marks")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<com.edupath.edupathservice.dto.MarksDTO>> getChildMarks(
            @PathVariable Long parentId, @PathVariable Long studentId) {
        parentService.validateParentChildRelationship(parentId, studentId);
        return ResponseEntity.ok(studentService.getStudentMarks(studentId));
    }

    @GetMapping("/{parentId}/student/{studentId}/attendance-summary")
    @PreAuthorize("permitAll()")
    public ResponseEntity<com.edupath.edupathservice.dto.StudentAttendanceSummaryDTO> getChildAttendanceSummary(
            @PathVariable Long parentId, @PathVariable Long studentId) {
        parentService.validateParentChildRelationship(parentId, studentId);
        return ResponseEntity.ok(studentService.getStudentAttendanceSummary(studentId));
    }

    @GetMapping("/{parentId}/student/{studentId}/attendance/subjects")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<com.edupath.edupathservice.dto.StudentSubjectAttendanceDTO>> getChildSubjectAttendance(
            @PathVariable Long parentId, @PathVariable Long studentId) {
        parentService.validateParentChildRelationship(parentId, studentId);
        return ResponseEntity.ok(studentService.getStudentSubjectAttendance(studentId));
    }

    @GetMapping("/{parentId}/student/{studentId}/overall-percentage")
    @PreAuthorize("permitAll()")
    public ResponseEntity<com.edupath.edupathservice.dto.StudentOverallPercentageDTO> getChildOverallPercentage(
            @PathVariable Long parentId, @PathVariable Long studentId) {
        parentService.validateParentChildRelationship(parentId, studentId);
        return ResponseEntity.ok(studentService.getStudentOverallPercentage(studentId));
    }

    @GetMapping("/{parentId}/student/{studentId}/class-rank")
    @PreAuthorize("permitAll()")
    public ResponseEntity<com.edupath.edupathservice.dto.StudentClassRankDTO> getChildClassRank(
            @PathVariable Long parentId, @PathVariable Long studentId) {
        parentService.validateParentChildRelationship(parentId, studentId);
        return ResponseEntity.ok(studentService.getStudentClassRank(studentId));
    }
}
