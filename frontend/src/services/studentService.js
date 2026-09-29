import { edupathApi } from './edupathApi';

export const getStudents = async () => {
  try {
    const data = await edupathApi.getAllStudents();
    if (Array.isArray(data)) {
      return data.map((s, idx) => ({
        id: s.id || idx + 1,
        name: s.fullName || s.name || `Student #${s.id}`,
        studentId: s.studentId || `STU-${s.id}`,
        classSection: s.className
          ? (s.className.startsWith('Class ') ? `${s.className}-${s.section || 'A'}` : `Class ${s.className}-${s.section || 'A'}`)
          : 'Class 10-A',
        attendance: s.attendancePercentage ? `${s.attendancePercentage}%` : '85%',
        score: s.gpa ? `${(s.gpa * 20).toFixed(0)}%` : '80%',
        risk: s.riskLevel || 'Low',
        action: s.riskLevel === 'High' ? 'Immediate Counseling' : 'Regular Follow-up',
        rawRecord: s,
      }));
    }
    return [];
  } catch (err) {
    console.error('[Student API Error] Failed to fetch students:', err);
    throw err;
  }
};

const parseClassAndSection = (classInput) => {
  if (!classInput) return { className: '10', section: 'A' };
  let str = String(classInput).replace(/^Class\s*/i, '').trim();
  if (str.includes('-')) {
    const parts = str.split('-');
    return {
      className: parts[0] ? parts[0].trim() : '10',
      section: parts[1] ? parts[1].trim() : 'A',
    };
  }
  if (str.length >= 2 && /[a-zA-Z]$/.test(str)) {
    return {
      className: str.slice(0, -1).trim(),
      section: str.slice(-1).toUpperCase(),
    };
  }
  return { className: str || '10', section: 'A' };
};

export const addStudent = async (student) => {
  const { className, section } = parseClassAndSection(student.classSection || student.department || student.className);

  const payload = {
    fullName: student.name || student.fullName,
    email: student.email || null,
    phoneNumber: student.phoneNumber || null,
    address: student.address || null,
    className: className,
    section: section,
    status: student.status || 'ACTIVE',
  };

  const res = await edupathApi.createStudent(payload);
  return res;
};

export const updateStudent = async (id, student) => {
  let className = student.className;
  let section = student.section;

  if (student.classSection || (!className && !section)) {
    const parsed = parseClassAndSection(student.classSection || student.className);
    className = parsed.className;
    section = parsed.section;
  }

  const payload = {
    fullName: student.fullName || student.name,
    email: student.email || null,
    phoneNumber: student.phoneNumber || null,
    address: student.address || null,
    className: className || '10',
    section: section || 'A',
    status: student.status || 'ACTIVE',
  };

  const res = await edupathApi.updateStudent(id, payload);
  return res;
};

export const deleteStudent = async (id) => {
  const res = await edupathApi.deleteStudent(id);
  return res;
};
