package com.edupath.edupathservice.repository;

import com.edupath.edupathservice.entity.Teacher;
import com.edupath.edupathservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    Optional<Teacher> findByEmployeeId(String employeeId);

    boolean existsByEmployeeId(String employeeId);

    Optional<Teacher> findByUser(User user);

    Optional<Teacher> findByUserId(Long userId);

    Optional<Teacher> findByEmail(String email);

    List<Teacher> findByDepartment(String department);

    List<Teacher> findByStatus(String status);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "UPDATE students SET class_teacher_id = NULL WHERE class_teacher_id = :teacherId", nativeQuery = true)
    void unlinkStudentsByTeacherId(@Param("teacherId") Long teacherId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "UPDATE attendance SET teacher_id = NULL WHERE teacher_id = :teacherId", nativeQuery = true)
    void unlinkAttendanceByTeacherId(@Param("teacherId") Long teacherId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "UPDATE marks SET teacher_id = NULL WHERE teacher_id = :teacherId", nativeQuery = true)
    void unlinkMarksByTeacherId(@Param("teacherId") Long teacherId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "UPDATE subjects SET teacher_id = NULL WHERE teacher_id = :teacherId", nativeQuery = true)
    void unlinkSubjectsByTeacherId(@Param("teacherId") Long teacherId);
}
