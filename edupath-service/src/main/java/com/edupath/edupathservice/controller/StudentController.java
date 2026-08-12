package com.edupath.edupathservice.controller;

import com.edupath.edupathservice.dto.StudentDTO;
import com.edupath.edupathservice.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDTO> createStudent(@RequestBody StudentDTO dto) {
        return ResponseEntity.status(201).body(studentService.createStudent(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @RequestBody StudentDTO dto) {
        return ResponseEntity.ok(studentService.updateStudent(id, dto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'COUNSELOR')")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'COUNSELOR')")
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/student-id/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'COUNSELOR')")
    public ResponseEntity<StudentDTO> getByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(studentService.getStudentByStudentId(studentId));
    }

    @GetMapping("/admission/{admissionNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<StudentDTO> getByAdmissionNumber(@PathVariable String admissionNumber) {
        return ResponseEntity.ok(studentService.getStudentByAdmissionNumber(admissionNumber));
    }

    @GetMapping("/class")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'COUNSELOR')")
    public ResponseEntity<List<StudentDTO>> getStudentsByClass(
            @RequestParam String className, @RequestParam String section) {
        return ResponseEntity.ok(studentService.getStudentsByClass(className, section));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'COUNSELOR')")
    public ResponseEntity<StudentDTO> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(studentService.getStudentByUserId(userId));
    }

    @PostMapping("/assign-teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDTO> assignTeacher(
            @RequestParam Long studentId, @RequestParam Long teacherId) {
        return ResponseEntity.ok(studentService.assignTeacher(studentId, teacherId));
    }

    @PostMapping("/assign-counselor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDTO> assignCounselor(
            @RequestParam Long studentId, @RequestParam Long counselorId) {
        return ResponseEntity.ok(studentService.assignCounselor(studentId, counselorId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }
}
