package com.edupath.edupathservice.service;

import com.edupath.edupathservice.dto.AttendanceDTO;

import java.util.List;

public interface AttendanceService {
    List<AttendanceDTO> getAllAttendance();
    AttendanceDTO markAttendance(AttendanceDTO dto);
    AttendanceDTO updateAttendance(Long id, AttendanceDTO dto);
    void deleteAttendance(Long id);
}
