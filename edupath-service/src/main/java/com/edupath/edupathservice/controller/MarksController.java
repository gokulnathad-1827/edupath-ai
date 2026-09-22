package com.edupath.edupathservice.controller;

import com.edupath.edupathservice.dto.MarksDTO;
import com.edupath.edupathservice.service.MarksService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
public class MarksController {

    private final MarksService marksService;

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<MarksDTO>> getAllMarks() {
        return ResponseEntity.ok(marksService.getAllMarks());
    }

    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<MarksDTO> addMarks(@RequestBody MarksDTO dto) {
        return new ResponseEntity<>(marksService.addMarks(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<MarksDTO> updateMarks(@PathVariable Long id, @RequestBody MarksDTO dto) {
        return ResponseEntity.ok(marksService.updateMarks(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Void> deleteMarks(@PathVariable Long id) {
        marksService.deleteMarks(id);
        return ResponseEntity.noContent().build();
    }
}
