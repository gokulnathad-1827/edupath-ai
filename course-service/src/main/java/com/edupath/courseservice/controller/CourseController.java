package com.edupath.courseservice.controller;

import com.edupath.courseservice.entity.Course;
import com.edupath.courseservice.service.CourseService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(
            @RequestBody Course course) {

        return new ResponseEntity<>(
                courseService.createCourse(course),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {

        return ResponseEntity.ok(
                courseService.getAllCourses()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                courseService.getCourseById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @RequestBody Course course) {

        return ResponseEntity.ok(
                courseService.updateCourse(id, course)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(
            @PathVariable Long id) {

        courseService.deleteCourse(id);

        return ResponseEntity.ok(
                "Course deleted successfully"
        );
    }
}