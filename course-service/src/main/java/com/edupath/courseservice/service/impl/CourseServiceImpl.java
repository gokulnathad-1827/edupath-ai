package com.edupath.courseservice.service.impl;

import com.edupath.courseservice.entity.Course;
import com.edupath.courseservice.repository.CourseRepository;
import com.edupath.courseservice.service.CourseService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Course not found with id: " + id));
    }

    @Override
    public Course updateCourse(Long id, Course course) {

        Course existingCourse = getCourseById(id);

        existingCourse.setName(course.getName());
        existingCourse.setDescription(course.getDescription());
        existingCourse.setCategory(course.getCategory());
        existingCourse.setDuration(course.getDuration());
        existingCourse.setLevel(course.getLevel());
        existingCourse.setProvider(course.getProvider());

        return courseRepository.save(existingCourse);
    }

    @Override
    public void deleteCourse(Long id) {
        Course existingCourse = getCourseById(id);
        courseRepository.delete(existingCourse);
    }
}