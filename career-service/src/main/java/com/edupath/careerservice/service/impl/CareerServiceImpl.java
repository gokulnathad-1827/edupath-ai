package com.edupath.careerservice.service.impl;

import com.edupath.careerservice.entity.Career;
import com.edupath.careerservice.repository.CareerRepository;
import com.edupath.careerservice.service.CareerService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CareerServiceImpl implements CareerService {

    private final CareerRepository careerRepository;

    public CareerServiceImpl(CareerRepository careerRepository) {
        this.careerRepository = careerRepository;
    }

    @Override
    public Career createCareer(Career career) {
        return careerRepository.save(career);
    }

    @Override
    public List<Career> getAllCareers() {
        return careerRepository.findAll();
    }

    @Override
    public Career getCareerById(Long id) {

        return careerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Career not found with id: " + id
                        )
                );
    }

    @Override
    public Career updateCareer(Long id, Career career) {

        Career existingCareer = getCareerById(id);

        existingCareer.setTitle(career.getTitle());
        existingCareer.setDescription(career.getDescription());
        existingCareer.setCategory(career.getCategory());
        existingCareer.setRequiredSkills(career.getRequiredSkills());
        existingCareer.setEducation(career.getEducation());
        existingCareer.setSalaryRange(career.getSalaryRange());
        existingCareer.setDemandLevel(career.getDemandLevel());

        return careerRepository.save(existingCareer);
    }

    @Override
    public void deleteCareer(Long id) {

        Career existingCareer = getCareerById(id);

        careerRepository.delete(existingCareer);
    }
}