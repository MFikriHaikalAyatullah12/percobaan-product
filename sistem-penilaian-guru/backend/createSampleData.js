const mongoose = require('mongoose');
const Student = require('./src/models/Student');

// Connect to database
const dbURI = process.env.DATABASE_URL || process.env.DB_URI || 'mongodb://localhost:27017/sistem-penilaian-guru';

async function createSampleStudents() {
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to database');

        // Clear existing students
        await Student.deleteMany({});
        console.log('Cleared existing students');

        // Dummy teacher ID (we'll use a dummy ObjectId)
        const dummyTeacherId = new mongoose.Types.ObjectId();

        // Sample students data
        const sampleStudents = [
            // Kelas 1
            { fullName: 'Ahmad Fauzi', nis: '2024001', email: 'ahmad.fauzi@email.com', class: '1', gender: 'male', dateOfBirth: new Date('2017-03-15'), address: 'Jl. Merdeka No. 1', parentName: 'Budi Fauzi', parentPhone: '081234567890', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Siti Aisyah', nis: '2024002', email: 'siti.aisyah@email.com', class: '1', gender: 'female', dateOfBirth: new Date('2017-05-20'), address: 'Jl. Melati No. 2', parentName: 'Hasan Ali', parentPhone: '081234567891', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Rina Putri', nis: '2024003', email: 'rina.putri@email.com', class: '1', gender: 'female', dateOfBirth: new Date('2017-07-10'), address: 'Jl. Mawar No. 3', parentName: 'Indra Putri', parentPhone: '081234567892', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Bayu Andi', nis: '2024004', email: 'bayu.andi@email.com', class: '1', gender: 'male', dateOfBirth: new Date('2017-02-28'), address: 'Jl. Anggrek No. 4', parentName: 'Sari Andi', parentPhone: '081234567893', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Dewi Lestari', nis: '2024005', email: 'dewi.lestari@email.com', class: '1', gender: 'female', dateOfBirth: new Date('2017-09-05'), address: 'Jl. Cempaka No. 5', parentName: 'Joko Lestari', parentPhone: '081234567894', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },

            // Kelas 2
            { fullName: 'Rizki Pratama', nis: '2023001', email: 'rizki.pratama@email.com', class: '2', gender: 'male', dateOfBirth: new Date('2016-04-12'), address: 'Jl. Dahlia No. 6', parentName: 'Wati Pratama', parentPhone: '081234567895', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Maya Sari', nis: '2023002', email: 'maya.sari@email.com', class: '2', gender: 'female', dateOfBirth: new Date('2016-06-18'), address: 'Jl. Kenanga No. 7', parentName: 'Dedi Sari', parentPhone: '081234567896', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Arif Rahman', nis: '2023003', email: 'arif.rahman@email.com', class: '2', gender: 'male', dateOfBirth: new Date('2016-01-25'), address: 'Jl. Flamboyan No. 8', parentName: 'Lia Rahman', parentPhone: '081234567897', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Citra Dewi', nis: '2023004', email: 'citra.dewi@email.com', class: '2', gender: 'female', dateOfBirth: new Date('2016-08-30'), address: 'Jl. Sakura No. 9', parentName: 'Eko Dewi', parentPhone: '081234567898', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },

            // Kelas 3
            { fullName: 'Dimas Saputra', nis: '2022001', email: 'dimas.saputra@email.com', class: '3', gender: 'male', dateOfBirth: new Date('2015-03-08'), address: 'Jl. Bougenville No. 10', parentName: 'Rini Saputra', parentPhone: '081234567899', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Fika Amelia', nis: '2022002', email: 'fika.amelia@email.com', class: '3', gender: 'female', dateOfBirth: new Date('2015-11-14'), address: 'Jl. Kamboja No. 11', parentName: 'Tono Amelia', parentPhone: '081234567800', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Galih Pranoto', nis: '2022003', email: 'galih.pranoto@email.com', class: '3', gender: 'male', dateOfBirth: new Date('2015-07-22'), address: 'Jl. Teratai No. 12', parentName: 'Yuni Pranoto', parentPhone: '081234567801', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },

            // Kelas 4
            { fullName: 'Hani Safitri', nis: '2021001', email: 'hani.safitri@email.com', class: '4', gender: 'female', dateOfBirth: new Date('2014-05-16'), address: 'Jl. Seroja No. 13', parentName: 'Beni Safitri', parentPhone: '081234567802', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Ivan Wijaya', nis: '2021002', email: 'ivan.wijaya@email.com', class: '4', gender: 'male', dateOfBirth: new Date('2014-12-03'), address: 'Jl. Tulip No. 14', parentName: 'Ani Wijaya', parentPhone: '081234567803', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Jihan Putri', nis: '2021003', email: 'jihan.putri@email.com', class: '4', gender: 'female', dateOfBirth: new Date('2014-09-27'), address: 'Jl. Lily No. 15', parentName: 'Agus Putri', parentPhone: '081234567804', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },

            // Kelas 5
            { fullName: 'Krisna Mahendra', nis: '2020001', email: 'krisna.mahendra@email.com', class: '5', gender: 'male', dateOfBirth: new Date('2013-10-11'), address: 'Jl. Sunflower No. 16', parentName: 'Dina Mahendra', parentPhone: '081234567805', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Luna Purnama', nis: '2020002', email: 'luna.purnama@email.com', class: '5', gender: 'female', dateOfBirth: new Date('2013-06-19'), address: 'Jl. Lavender No. 17', parentName: 'Fajar Purnama', parentPhone: '081234567806', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },

            // Kelas 6
            { fullName: 'Miko Aditya', nis: '2019001', email: 'miko.aditya@email.com', class: '6', gender: 'male', dateOfBirth: new Date('2012-04-07'), address: 'Jl. Jasmine No. 18', parentName: 'Erni Aditya', parentPhone: '081234567807', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Nina Kartika', nis: '2019002', email: 'nina.kartika@email.com', class: '6', gender: 'female', dateOfBirth: new Date('2012-12-23'), address: 'Jl. Orchid No. 19', parentName: 'Hendra Kartika', parentPhone: '081234567808', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true },
            { fullName: 'Oka Permana', nis: '2019003', email: 'oka.permana@email.com', class: '6', gender: 'male', dateOfBirth: new Date('2012-08-15'), address: 'Jl. Rose No. 20', parentName: 'Ika Permana', parentPhone: '081234567809', academicYear: '2024/2025', teacherId: dummyTeacherId, isActive: true }
        ];

        // Insert sample students
        const createdStudents = await Student.insertMany(sampleStudents);
        console.log(`Created ${createdStudents.length} sample students`);

        // Display summary by class
        for (let i = 1; i <= 6; i++) {
            const count = await Student.countDocuments({ class: i.toString() });
            console.log(`Kelas ${i}: ${count} siswa`);
        }

        console.log('Sample data creation completed!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error creating sample students:', error);
        mongoose.connection.close();
    }
}

createSampleStudents();
