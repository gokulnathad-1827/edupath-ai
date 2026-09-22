package com.edupath.edupathservice.repository;

import com.edupath.edupathservice.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findAllByOrderByIdDesc();
}
