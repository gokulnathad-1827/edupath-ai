package com.edupath.edupathservice.repository;

import com.edupath.edupathservice.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findAllByOrderByIdDesc();
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByTeacherId(Long teacherId);
}
