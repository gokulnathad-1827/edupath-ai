package com.edupath.careerservice.service;

import com.edupath.careerservice.entity.Career;

import java.util.List;

public interface CareerService {

    Career createCareer(Career career);

    List<Career> getAllCareers();

    Career getCareerById(Long id);

    Career updateCareer(Long id, Career career);

    void deleteCareer(Long id);
}