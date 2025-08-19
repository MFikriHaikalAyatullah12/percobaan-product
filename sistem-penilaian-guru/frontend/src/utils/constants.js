export const API_BASE_URL = 'http://localhost:5000/api';
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5 MB
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/gif'];
export const SUPPORTED_DOCUMENT_FORMATS = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const USER_ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
};