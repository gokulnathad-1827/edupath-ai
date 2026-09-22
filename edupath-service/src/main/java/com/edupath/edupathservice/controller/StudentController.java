package com.edupath.edupathservice.controller;

import com.edupath.edupathservice.dto.DropoutRiskResponseDTO;
import com.edupath.edupathservice.dto.StudentAttendanceSummaryDTO;
import com.edupath.edupathservice.dto.StudentClassRankDTO;
import com.edupath.edupathservice.dto.StudentDTO;
import com.edupath.edupathservice.dto.StudentOverallPercentageDTO;
import com.edupath.edupathservice.service.StudentAiService;
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
    private final StudentAiService studentAiService;

    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentDTO> createStudent(@RequestBody StudentDTO dto) {
        return ResponseEntity.ok(studentService.createStudent(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @RequestBody StudentDTO dto) {
        return ResponseEntity.ok(studentService.updateStudent(id, dto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/{id}/dropout-risk")
    @PreAuthorize("permitAll()")
    public ResponseEntity<DropoutRiskResponseDTO> getStudentDropoutRisk(@PathVariable Long id) {
        return ResponseEntity.ok(studentAiService.predictStudentDropoutRisk(id));
    }

    @GetMapping("/{id}/overall-percentage")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentOverallPercentageDTO> getStudentOverallPercentage(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentOverallPercentage(id));
    }

    @GetMapping("/{id}/class-rank")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentClassRankDTO> getStudentClassRank(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentClassRank(id));
    }

    @GetMapping("/{id}/attendance-summary")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentAttendanceSummaryDTO> getStudentAttendanceSummary(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentAttendanceSummary(id));
    }

    @GetMapping("/{id}/attendance/subjects")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<com.edupath.edupathservice.dto.StudentSubjectAttendanceDTO>> getStudentSubjectAttendance(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentSubjectAttendance(id));
    }

    @GetMapping("/{id}/marks")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<com.edupath.edupathservice.dto.MarksDTO>> getStudentMarks(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentMarks(id));
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/student-id/{studentId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentDTO> getByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(studentService.getStudentByStudentId(studentId));
    }

    @GetMapping("/admission/{admissionNumber}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentDTO> getByAdmissionNumber(@PathVariable String admissionNumber) {
        return ResponseEntity.ok(studentService.getStudentByAdmissionNumber(admissionNumber));
    }

    @GetMapping("/class")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<StudentDTO>> getStudentsByClass(
            @RequestParam String className, @RequestParam String section) {
        return ResponseEntity.ok(studentService.getStudentsByClass(className, section));
    }

    @GetMapping("/user/{identifier}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentDTO> getByUserId(@PathVariable String identifier) {
        return ResponseEntity.ok(studentService.findStudentByIdentifier(identifier));
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentDTO> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(studentService.getStudentByEmail(email));
    }

    @PostMapping("/assign-teacher")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentDTO> assignTeacher(
            @RequestParam Long studentId, @RequestParam Long teacherId) {
        return ResponseEntity.ok(studentService.assignTeacher(studentId, teacherId));
    }

    @PostMapping("/assign-counselor")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentDTO> assignCounselor(
            @RequestParam Long studentId, @RequestParam Long counselorId) {
        return ResponseEntity.ok(studentService.assignCounselor(studentId, counselorId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }
}
