package com.edupath.edupathservice.repository;

import com.edupath.edupathservice.entity.Student;
import com.edupath.edupathservice.entity.StudentAcademicProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentAcademicProfileRepository extends JpaRepository<StudentAcademicProfile, Long> {

    Optional<StudentAcademicProfile> findByStudentId(Long studentId);

    Optional<StudentAcademicProfile> findByStudent(Student student);
}
