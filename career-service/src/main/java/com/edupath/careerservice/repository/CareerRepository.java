package com.edupath.careerservice.repository;

import com.edupath.careerservice.entity.Career;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerRepository extends JpaRepository<Career, Long> {

}