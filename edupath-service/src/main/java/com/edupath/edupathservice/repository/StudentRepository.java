package com.edupath.edupathservice.repository;

import com.edupath.edupathservice.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    Optional<Student> findByEmail(String email);

    List<Student> findByClassName(String className);

    List<Student> findBySection(String section);

    List<Student> findByClassNameAndSection(String className, String section);

    List<Student> findByClassTeacher(Teacher classTeacher);

    List<Student> findByParent(Parent parent);

    List<Student> findByCounselor(Counselor counselor);

    Optional<Student> findByRollNumber(String rollNumber);

    List<Student> findByStatus(String status);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM counseling_sessions WHERE student_id = :studentId", nativeQuery = true)
    void deleteCounselingSessionsByStudentId(@Param("studentId") Long studentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM attendance WHERE student_id = :studentId", nativeQuery = true)
    void deleteAttendanceByStudentId(@Param("studentId") Long studentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM attendances WHERE student_id = :studentId", nativeQuery = true)
    void deleteAttendancesByStudentId(@Param("studentId") Long studentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM marks WHERE student_id = :studentId", nativeQuery = true)
    void deleteMarksByStudentId(@Param("studentId") Long studentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM career_rec_courses WHERE career_rec_id IN (SELECT id FROM career_recommendations WHERE student_id = :studentId)", nativeQuery = true)
    void deleteCareerRecCoursesByStudentId(@Param("studentId") Long studentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM career_rec_skills WHERE career_rec_id IN (SELECT id FROM career_recommendations WHERE student_id = :studentId)", nativeQuery = true)
    void deleteCareerRecSkillsByStudentId(@Param("studentId") Long studentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM career_recommendations WHERE student_id = :studentId", nativeQuery = true)
    void deleteCareerRecommendationsByStudentId(@Param("studentId") Long studentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM career_assessments WHERE student_id = :studentId", nativeQuery = true)
    void deleteCareerAssessmentsByStudentId(@Param("studentId") Long studentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM student_academic_profiles WHERE student_id = :studentId", nativeQuery = true)
    void deleteStudentAcademicProfileByStudentId(@Param("studentId") Long studentId);
}
