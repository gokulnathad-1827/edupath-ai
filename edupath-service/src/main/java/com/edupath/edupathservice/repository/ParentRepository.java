package com.edupath.edupathservice.repository;

import com.edupath.edupathservice.entity.Parent;
import com.edupath.edupathservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Long> {

    Optional<Parent> findByParentId(String parentId);

    boolean existsByParentId(String parentId);

    Optional<Parent> findByUser(User user);

    Optional<Parent> findByUserId(Long userId);

    Optional<Parent> findByEmail(String email);

    List<Parent> findByStatus(String status);
}
