class Student {
    constructor(id, name, age, grade, subjects) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.grade = grade;
        this.subjects = subjects; // Array of subject IDs
    }

    // Method to get student details
    getDetails() {
        return {
            id: this.id,
            name: this.name,
            age: this.age,
            grade: this.grade,
            subjects: this.subjects,
        };
    }

    // Method to update student information
    updateInfo(newInfo) {
        Object.assign(this, newInfo);
    }
}

module.exports = Student;