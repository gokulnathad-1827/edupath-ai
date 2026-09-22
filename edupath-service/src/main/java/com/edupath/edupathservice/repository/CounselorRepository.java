package com.edupath.edupathservice.repository;

import com.edupath.edupathservice.entity.Counselor;
import com.edupath.edupathservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CounselorRepository extends JpaRepository<Counselor, Long> {

    Optional<Counselor> findByCounselorId(String counselorId);

    boolean existsByCounselorId(String counselorId);

    Optional<Counselor> findByUser(User user);

    Optional<Counselor> findByUserId(Long userId);

    Optional<Counselor> findByEmail(String email);

    List<Counselor> findBySpecialization(String specialization);

    List<Counselor> findByStatus(String status);
}
