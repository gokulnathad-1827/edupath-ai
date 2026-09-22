package com.edupath.edupathservice.controller;

import com.edupath.edupathservice.dto.TeacherDTO;
import com.edupath.edupathservice.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.edupath.edupathservice.dto.TeacherReportDTO;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<TeacherDTO> createTeacher(@RequestBody TeacherDTO dto) {
        return new ResponseEntity<>(teacherService.createTeacher(dto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<TeacherDTO>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<TeacherDTO> getTeacherById(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getTeacherById(id));
    }

    @GetMapping("/{id}/report")
    @PreAuthorize("permitAll()")
    public ResponseEntity<TeacherReportDTO> getTeacherReport(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getTeacherReport(id));
    }

    @GetMapping("/user/{identifier}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<TeacherDTO> getTeacherByIdentifier(@PathVariable String identifier) {
        return ResponseEntity.ok(teacherService.findTeacherByIdentifier(identifier));
    }

    @GetMapping("/user/{identifier}/report")
    @PreAuthorize("permitAll()")
    public ResponseEntity<TeacherReportDTO> getTeacherReportByIdentifier(@PathVariable String identifier) {
        TeacherDTO teacher = teacherService.findTeacherByIdentifier(identifier);
        return ResponseEntity.ok(teacherService.getTeacherReport(teacher.getId()));
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<TeacherDTO> getTeacherByEmail(@PathVariable String email) {
        return ResponseEntity.ok(teacherService.getTeacherByEmail(email));
    }

    @PutMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<TeacherDTO> updateTeacher(@PathVariable Long id, @RequestBody TeacherDTO dto) {
        return ResponseEntity.ok(teacherService.updateTeacher(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Map<String, String>> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.ok(Map.of("message", "Teacher deleted successfully"));
    }
}
