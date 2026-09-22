package com.edupath.edupathservice.controller;

import com.edupath.edupathservice.dto.CounselingSessionDTO;
import com.edupath.edupathservice.service.CounselingSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/counseling/sessions")
@RequiredArgsConstructor
public class CounselingSessionController {

    private final CounselingSessionService sessionService;

    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<CounselingSessionDTO> createSession(@RequestBody CounselingSessionDTO dto) {
        return new ResponseEntity<>(sessionService.createSession(dto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<CounselingSessionDTO>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<CounselingSessionDTO> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<CounselingSessionDTO> updateSession(@PathVariable Long id, @RequestBody CounselingSessionDTO dto) {
        return ResponseEntity.ok(sessionService.updateSession(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Map<String, String>> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.ok(Map.of("message", "Counseling session deleted successfully"));
    }
}
