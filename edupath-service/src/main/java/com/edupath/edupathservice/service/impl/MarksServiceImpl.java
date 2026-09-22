package com.edupath.edupathservice.service.impl;

import com.edupath.edupathservice.dto.MarksDTO;
import com.edupath.edupathservice.entity.Marks;
import com.edupath.edupathservice.repository.MarksRepository;
import com.edupath.edupathservice.service.MarksService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MarksServiceImpl implements MarksService {

    private final MarksRepository marksRepository;

    private MarksDTO toDTO(Marks entity) {
        if (entity == null) return null;
        return MarksDTO.builder()
                .id(entity.getId())
                .studentName(entity.getStudentName())
                .name(entity.getStudentName())
                .subject(entity.getSubject())
                .marks(entity.getMarks())
                .date(entity.getDate())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public List<MarksDTO> getAllMarks() {
        List<Marks> list = marksRepository.findAllByOrderByIdDesc();
        if (list.isEmpty()) {
            LocalDate dateVal = LocalDate.now().minusDays(1);
            LocalDateTime dtVal = LocalDateTime.now().minusDays(1);

            Marks m1 = Marks.builder()
                    .studentName("Arjun Sharma")
                    .subject("Mathematics")
                    .marks("85")
                    .date(dateVal)
                    .createdAt(dtVal)
                    .build();

            Marks m2 = Marks.builder()
                    .studentName("Rahul Kumar")
                    .subject("Science")
                    .marks("58")
                    .date(dateVal)
                    .createdAt(dtVal)
                    .build();

            Marks m3 = Marks.builder()
                    .studentName("Priya Sharma")
                    .subject("English")
                    .marks("67")
                    .date(dateVal)
                    .createdAt(dtVal)
                    .build();

            marksRepository.saveAll(List.of(m1, m2, m3));
            list = marksRepository.findAllByOrderByIdDesc();
        }

        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public MarksDTO addMarks(MarksDTO dto) {
        String nameStr = dto.getStudentName() != null && !dto.getStudentName().trim().isEmpty()
                ? dto.getStudentName().trim()
                : (dto.getName() != null && !dto.getName().trim().isEmpty() ? dto.getName().trim() : "Student");

        String subjectStr = dto.getSubject() != null && !dto.getSubject().trim().isEmpty()
                ? dto.getSubject().trim()
                : "General";

        String marksStr = dto.getMarks() != null && !dto.getMarks().trim().isEmpty()
                ? dto.getMarks().trim()
                : "0";

        LocalDate dateVal = dto.getDate() != null ? dto.getDate() : LocalDate.now();

        Marks marks = Marks.builder()
                .studentName(nameStr)
                .subject(subjectStr)
                .marks(marksStr)
                .date(dateVal)
                .createdAt(LocalDateTime.now())
                .build();

        Marks saved = marksRepository.save(marks);
        return toDTO(saved);
    }

    @Override
    public MarksDTO updateMarks(Long id, MarksDTO dto) {
        Marks marks = marksRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marks record not found with id: " + id));

        if (dto.getStudentName() != null && !dto.getStudentName().trim().isEmpty()) {
            marks.setStudentName(dto.getStudentName().trim());
        } else if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            marks.setStudentName(dto.getName().trim());
        }

        if (dto.getSubject() != null && !dto.getSubject().trim().isEmpty()) {
            marks.setSubject(dto.getSubject().trim());
        }

        if (dto.getMarks() != null && !dto.getMarks().trim().isEmpty()) {
            marks.setMarks(dto.getMarks().trim());
        }

        if (dto.getDate() != null) {
            marks.setDate(dto.getDate());
        }

        Marks updated = marksRepository.save(marks);
        return toDTO(updated);
    }

    @Override
    public void deleteMarks(Long id) {
        if (!marksRepository.existsById(id)) {
            throw new RuntimeException("Marks record not found with id: " + id);
        }
        marksRepository.deleteById(id);
    }
}
