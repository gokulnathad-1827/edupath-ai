package com.edupath.edupathservice.service.impl;

import com.edupath.edupathservice.dto.StudentDTO;
import com.edupath.edupathservice.entity.Counselor;
import com.edupath.edupathservice.entity.Parent;
import com.edupath.edupathservice.entity.Student;
import com.edupath.edupathservice.entity.Teacher;
import com.edupath.edupathservice.entity.User;
import com.edupath.edupathservice.exception.DuplicateResourceException;
import com.edupath.edupathservice.exception.ResourceNotFoundException;
import com.edupath.edupathservice.mapper.StudentMapper;
import com.edupath.edupathservice.repository.CounselorRepository;
import com.edupath.edupathservice.repository.ParentRepository;
import com.edupath.edupathservice.repository.StudentRepository;
import com.edupath.edupathservice.repository.TeacherRepository;
import com.edupath.edupathservice.repository.UserRepository;
import com.edupath.edupathservice.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CounselorRepository counselorRepository;
    private final ParentRepository parentRepository;
    private final UserRepository userRepository;
    private final StudentMapper studentMapper;

    @Override
    public StudentDTO createStudent(StudentDTO dto) {

        if (dto.getStudentId() != null &&
                studentRepository.existsByStudentId(dto.getStudentId())) {
            throw new DuplicateResourceException(
                    "Student", "studentId", dto.getStudentId());
        }

        if (dto.getAdmissionNumber() != null &&
                studentRepository.existsByAdmissionNumber(dto.getAdmissionNumber())) {
            throw new DuplicateResourceException(
                    "Student", "admissionNumber", dto.getAdmissionNumber());
        }

        Student student = studentMapper.toEntity(dto);

        // Required User
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", dto.getUserId()));
        student.setUser(user);

        // Optional Parent
        if (dto.getParentId() != null) {
            Parent parent = parentRepository.findById(dto.getParentId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Parent", "id", dto.getParentId()));
            student.setParent(parent);
        }

        // Optional Counselor
        if (dto.getCounselorId() != null) {
            Counselor counselor = counselorRepository.findById(dto.getCounselorId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Counselor", "id", dto.getCounselorId()));
            student.setCounselor(counselor);
        }

        // Optional Class Teacher
        if (dto.getClassTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(dto.getClassTeacherId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Teacher", "id", dto.getClassTeacherId()));
            student.setClassTeacher(teacher);
        }

        Student savedStudent = studentRepository.save(student);
        return studentMapper.toDTO(savedStudent);
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO dto) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "id", id));

        student.setFullName(dto.getFullName());
        student.setGender(dto.getGender());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setClassName(dto.getClassName());
        student.setSection(dto.getSection());
        student.setAcademicYear(dto.getAcademicYear());
        student.setBloodGroup(dto.getBloodGroup());
        student.setAddress(dto.getAddress());
        student.setPhoneNumber(dto.getPhoneNumber());
        student.setParentPhone(dto.getParentPhone());
        student.setEmail(dto.getEmail());
        student.setStatus(dto.getStatus());

        if (dto.getParentId() != null) {
            Parent parent = parentRepository.findById(dto.getParentId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Parent", "id", dto.getParentId()));
            student.setParent(parent);
        }

        if (dto.getCounselorId() != null) {
            Counselor counselor = counselorRepository.findById(dto.getCounselorId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Counselor", "id", dto.getCounselorId()));
            student.setCounselor(counselor);
        }

        if (dto.getClassTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(dto.getClassTeacherId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Teacher", "id", dto.getClassTeacherId()));
            student.setClassTeacher(teacher);
        }

        return studentMapper.toDTO(studentRepository.save(student));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "id", id));

        return studentMapper.toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByStudentId(String studentId) {

        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "studentId", studentId));

        return studentMapper.toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByAdmissionNumber(String admissionNumber) {

        Student student = studentRepository.findByAdmissionNumber(admissionNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "admissionNumber", admissionNumber));

        return studentMapper.toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByUserId(Long userId) {

        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "userId", userId));

        return studentMapper.toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO findByRollNumber(String rollNumber) {

        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "rollNumber", rollNumber));

        return studentMapper.toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByClass(String className, String section) {
        return studentMapper.toDTOList(
                studentRepository.findByClassNameAndSection(className, section));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getAllStudents() {
        return studentMapper.toDTOList(studentRepository.findAll());
    }

    @Override
    public StudentDTO assignTeacher(Long studentId, Long teacherId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "id", studentId));

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher", "id", teacherId));

        student.setClassTeacher(teacher);

        return studentMapper.toDTO(studentRepository.save(student));
    }

    @Override
    public StudentDTO assignCounselor(Long studentId, Long counselorId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "id", studentId));

        Counselor counselor = counselorRepository.findById(counselorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Counselor", "id", counselorId));

        student.setCounselor(counselor);

        return studentMapper.toDTO(studentRepository.save(student));
    }

    @Override
    public void deleteStudent(Long id) {

        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student", "id", id);
        }

        studentRepository.deleteById(id);
    }
}
