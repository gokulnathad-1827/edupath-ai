package com.edupath.careerservice.controller;

import com.edupath.careerservice.entity.Career;
import com.edupath.careerservice.service.CareerService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/careers")
@CrossOrigin(origins = "*")
public class CareerController {

    private final CareerService careerService;

    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    // Create a new career
    @PostMapping
    public ResponseEntity<Career> createCareer(
            @RequestBody Career career) {

        Career createdCareer = careerService.createCareer(career);

        return new ResponseEntity<>(
                createdCareer,
                HttpStatus.CREATED
        );
    }

    // Get all careers
    @GetMapping
    public ResponseEntity<List<Career>> getAllCareers() {

        return ResponseEntity.ok(
                careerService.getAllCareers()
        );
    }

    // Get career by ID
    @GetMapping("/{id}")
    public ResponseEntity<Career> getCareerById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                careerService.getCareerById(id)
        );
    }

    // Update career
    @PutMapping("/{id}")
    public ResponseEntity<Career> updateCareer(
            @PathVariable Long id,
            @RequestBody Career career) {

        return ResponseEntity.ok(
                careerService.updateCareer(id, career)
        );
    }

    // Delete career
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCareer(
            @PathVariable Long id) {

        careerService.deleteCareer(id);

        return ResponseEntity.ok(
                "Career deleted successfully"
        );
    }
}