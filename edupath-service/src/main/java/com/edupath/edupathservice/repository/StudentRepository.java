package com.edupath.edupathservice.repository;

import com.edupath.edupathservice.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentId(String studentId);

    boolean existsByStudentId(String studentId);

    Optional<Student> findByAdmissionNumber(String admissionNumber);

    boolean existsByAdmissionNumber(String admissionNumber);

    Optional<Student> findByUser(User user);

    Optional<Student> findByUserId(Long userId);

    List<Student> findByClassName(String className);

    List<Student> findBySection(String section);

    List<Student> findByClassNameAndSection(String className, String section);

    List<Student> findByClassTeacher(Teacher classTeacher);

    List<Student> findByParent(Parent parent);

    List<Student> findByCounselor(Counselor counselor);

    Optional<Student> findByRollNumber(String rollNumber);

    List<Student> findByStatus(String status);
}
