class Grade {
    constructor(studentId, subjectId, score) {
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.score = score;
    }

    static validateScore(score) {
        if (score < 0 || score > 100) {
            throw new Error('Score must be between 0 and 100');
        }
    }
}

module.exports = Grade;