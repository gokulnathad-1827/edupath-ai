package com.edupath.edupathservice.service.impl;

import com.edupath.edupathservice.dto.ParentDTO;
import com.edupath.edupathservice.dto.StudentDTO;
import com.edupath.edupathservice.entity.Parent;
import com.edupath.edupathservice.entity.Student;
import com.edupath.edupathservice.entity.User;
import com.edupath.edupathservice.exception.ResourceNotFoundException;
import com.edupath.edupathservice.mapper.StudentMapper;
import com.edupath.edupathservice.repository.ParentRepository;
import com.edupath.edupathservice.repository.StudentRepository;
import com.edupath.edupathservice.repository.UserRepository;
import com.edupath.edupathservice.service.ParentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ParentServiceImpl implements ParentService {

    @Autowired
    private ParentRepository parentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentMapper studentMapper;


    private ParentDTO toDTO(Parent parent) {
        if (parent == null) return null;
        return ParentDTO.builder()
                .id(parent.getId())
                .parentId(parent.getParentId())
                .fullName(parent.getFullName())
                .fatherName(parent.getFatherName())
                .motherName(parent.getMotherName())
                .guardianName(parent.getGuardianName())
                .relationship(parent.getRelationship())
                .email(parent.getEmail())
                .phoneNumber(parent.getPhoneNumber())
                .address(parent.getAddress())
                .occupation(parent.getOccupation())
                .childName(parent.getChildName())
                .status(parent.getStatus())
                .userId(parent.getUser() != null ? parent.getUser().getId() : null)
                .build();
    }

    private Parent toEntity(ParentDTO dto) {
        if (dto == null) return null;
        return Parent.builder()
                .parentId(dto.getParentId())
                .fullName(dto.getFullName() != null ? dto.getFullName() : dto.getFatherName())
                .fatherName(dto.getFatherName())
                .motherName(dto.getMotherName())
                .guardianName(dto.getGuardianName())
                .relationship(dto.getRelationship())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .occupation(dto.getOccupation())
                .childName(dto.getChildName())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();
    }

    @Override
    public ParentDTO createParent(ParentDTO parentDTO) {
        Parent parent = toEntity(parentDTO);

        Long numericUserId = parentDTO.getNumericUserId();
        User user = null;
        if (numericUserId != null) {
            user = userRepository.findById(numericUserId).orElse(null);
        }
        if (user == null && parentDTO.getEmail() != null) {
            user = userRepository.findByEmail(parentDTO.getEmail().trim()).orElse(null);
        }
        if (user != null) {
            parent.setUser(user);
        }

        Parent saved = parentRepository.save(parent);
        return toDTO(saved);
    }

    @Override
    public ParentDTO updateParent(Long id, ParentDTO dto) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", "id", id));

        if (dto.getFullName() != null) parent.setFullName(dto.getFullName().trim());
        if (dto.getFatherName() != null) parent.setFatherName(dto.getFatherName().trim());
        if (dto.getMotherName() != null) parent.setMotherName(dto.getMotherName().trim());
        if (dto.getGuardianName() != null) parent.setGuardianName(dto.getGuardianName().trim());
        if (dto.getRelationship() != null) parent.setRelationship(dto.getRelationship().trim());
        if (dto.getEmail() != null) parent.setEmail(dto.getEmail().trim());
        if (dto.getPhoneNumber() != null) parent.setPhoneNumber(dto.getPhoneNumber().trim());
        if (dto.getAddress() != null) parent.setAddress(dto.getAddress().trim());
        if (dto.getOccupation() != null) parent.setOccupation(dto.getOccupation().trim());
        if (dto.getChildName() != null) parent.setChildName(dto.getChildName().trim());
        if (dto.getStatus() != null) parent.setStatus(dto.getStatus().trim());

        // Link User if not linked yet
        if (parent.getUser() == null) {
            Long numericUserId = dto.getNumericUserId();
            User user = null;
            if (numericUserId != null) {
                user = userRepository.findById(numericUserId).orElse(null);
            }
            if (user == null && parent.getEmail() != null) {
                user = userRepository.findByEmail(parent.getEmail().trim()).orElse(null);
            }
            if (user != null) {
                parent.setUser(user);
            }
        }

        // Synchronize with User entity if linked
        try {
            if (parent.getUser() != null) {
                User user = parent.getUser();
                if (parent.getFullName() != null) user.setFullName(parent.getFullName());
                if (parent.getEmail() != null) user.setEmail(parent.getEmail());
                if (parent.getPhoneNumber() != null) user.setPhoneNumber(parent.getPhoneNumber());
                userRepository.save(user);
            }
        } catch (Exception ignored) {}

        Parent updated = parentRepository.save(parent);
        return toDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public ParentDTO getParentById(Long id) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", "id", id));
        return toDTO(parent);
    }

    @Override
    public ParentDTO findParentByIdentifier(String identifier) {
        if (identifier == null || identifier.trim().isEmpty()) {
            throw new ResourceNotFoundException("Parent", "identifier", identifier);
        }
        String cleanId = identifier.trim();

        // 1. Try email or parentId first
        Optional<Parent> byEmail = parentRepository.findByEmail(cleanId);
        if (byEmail.isPresent()) return toDTO(byEmail.get());

        Optional<Parent> byPId = parentRepository.findByParentId(cleanId);
        if (byPId.isPresent()) return toDTO(byPId.get());

        // 2. Try by userId or numeric entity ID
        try {
            Long numericId = Long.parseLong(cleanId);
            Optional<Parent> byUserId = parentRepository.findByUserId(numericId);
            if (byUserId.isPresent()) return toDTO(byUserId.get());

            Optional<Parent> byId = parentRepository.findById(numericId);
            if (byId.isPresent()) return toDTO(byId.get());
        } catch (NumberFormatException ignored) {}

        // 3. Fallback: If cleanId is an email, check if user exists or throw ResourceNotFoundException
        if (cleanId.contains("@")) {
            Optional<User> uOpt = userRepository.findByEmail(cleanId);
            if (uOpt.isPresent()) {
                User u = uOpt.get();
                ParentDTO newParent = ParentDTO.builder()
                        .parentId("PAR-" + System.currentTimeMillis())
                        .fullName(u.getFullName() != null ? u.getFullName() : "Parent")
                        .fatherName(u.getFullName() != null ? u.getFullName() : "Parent")
                        .email(u.getEmail())
                        .phoneNumber(u.getPhoneNumber())
                        .status("ACTIVE")
                        .userId(u.getId())
                        .build();
                return createParent(newParent);
            }
        }

        throw new ResourceNotFoundException("Parent", "identifier", identifier);
    }

    @Override
    public ParentDTO getParentByEmail(String email) {
        return findParentByIdentifier(email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParentDTO> getAllParents() {
        return parentRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteParent(Long id) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", "id", id));

        List<Student> students = studentRepository.findByParent(parent);
        for (Student student : students) {
            student.setParent(null);
        }
        studentRepository.saveAllAndFlush(students);

        parent.setUser(null);
        parentRepository.saveAndFlush(parent);

        parentRepository.delete(parent);
        parentRepository.flush();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getLinkedStudentForParent(Long parentId) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", "id", parentId));

        List<Student> studentsByParent = studentRepository.findByParent(parent);
        if (!studentsByParent.isEmpty()) {
            return studentMapper.toDTO(studentsByParent.get(0));
        }

        if (parent.getChildName() != null && !parent.getChildName().trim().isEmpty()) {
            String childName = parent.getChildName().trim();
            Optional<Student> studentByName = studentRepository.findAll().stream()
                    .filter(s -> s.getFullName() != null && s.getFullName().equalsIgnoreCase(childName))
                    .findFirst();
            if (studentByName.isPresent()) {
                return studentMapper.toDTO(studentByName.get());
            }
        }

        throw new ResourceNotFoundException("Student", "parentId", parentId);
    }

    @Override
    @Transactional(readOnly = true)
    public void validateParentChildRelationship(Long parentId, Long studentId) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", "id", parentId));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        boolean isLinked = false;
        if (student.getParent() != null && student.getParent().getId().equals(parent.getId())) {
            isLinked = true;
        } else if (parent.getChildName() != null && student.getFullName() != null) {
            String pChild = parent.getChildName().trim();
            String sName = student.getFullName().trim();
            if (pChild.equalsIgnoreCase(sName)) {
                isLinked = true;
            }
        }

        if (!isLinked) {
            throw new org.springframework.security.access.AccessDeniedException(
                "Access Denied: Parent ID " + parentId + " (" + parent.getFullName() + ") is NOT authorized to access Student ID " + studentId + " (" + student.getFullName() + ")'s private records."
            );
        }
    }
}

