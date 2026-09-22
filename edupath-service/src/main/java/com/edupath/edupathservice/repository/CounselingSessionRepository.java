package com.edupath.edupathservice.repository;

import com.edupath.edupathservice.entity.CounselingSession;
import com.edupath.edupathservice.entity.Counselor;
import com.edupath.edupathservice.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CounselingSessionRepository extends JpaRepository<CounselingSession, Long> {
    List<CounselingSession> findByStatus(String status);
    List<CounselingSession> findByStudentNameContainingIgnoreCase(String studentName);
    List<CounselingSession> findByStudent(Student student);
    List<CounselingSession> findByCounselor(Counselor counselor);
}

