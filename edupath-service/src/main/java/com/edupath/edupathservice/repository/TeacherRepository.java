package com.edupath.edupathservice.repository;

import com.edupath.edupathservice.entity.Teacher;
import com.edupath.edupathservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    Optional<Teacher> findByEmployeeId(String employeeId);

    boolean existsByEmployeeId(String employeeId);

    Optional<Teacher> findByUser(User user);

    Optional<Teacher> findByUserId(Long userId);

    List<Teacher> findByDepartment(String department);

    List<Teacher> findByStatus(String status);
}
