import { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/api';
import toast from 'react-hot-toast';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all students
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStudents();
      if (response.success) {
        setStudents(response.data.students || []);
      } else {
        setError(response.message || 'Failed to fetch students');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch students');
      toast.error('Gagal mengambil data siswa');
    } finally {
      setLoading(false);
    }
  };

  // Add new student
  const addStudent = async (studentData) => {
    try {
      const response = await createStudent(studentData);
      if (response.success) {
        setStudents(prev => [...prev, response.data.student]);
        toast.success('Siswa berhasil ditambahkan');
        return { success: true };
      } else {
        toast.error(response.message || 'Gagal menambahkan siswa');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = err.message || 'Gagal menambahkan siswa';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update student
  const editStudent = async (studentId, studentData) => {
    try {
      const response = await updateStudent(studentId, studentData);
      if (response.success) {
        setStudents(prev => 
          prev.map(student => 
            student._id === studentId ? response.data.student : student
          )
        );
        toast.success('Data siswa berhasil diupdate');
        return { success: true };
      } else {
        toast.error(response.message || 'Gagal mengupdate siswa');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = err.message || 'Gagal mengupdate siswa';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete student
  const removeStudent = async (studentId) => {
    try {
      const response = await deleteStudent(studentId);
      if (response.success) {
        setStudents(prev => prev.filter(student => student._id !== studentId));
        toast.success('Siswa berhasil dihapus');
        return { success: true };
      } else {
        toast.error(response.message || 'Gagal menghapus siswa');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = err.message || 'Gagal menghapus siswa';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Load students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    addStudent,
    editStudent,
    removeStudent,
  };
};
