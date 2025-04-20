const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ firstName: 1 });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const existingStudent = await Student.findOne({ email: newStudent.email });
    if (existingStudent) {
      return res.status(400).json({ message: 'A student with this email already exists' });
    }
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete student by ID
exports.deleteStudentById = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update student by ID
exports.updateStudentById = async (req, res) => {
  try {
    const { firstName, lastName, age, gender, email, phone } = req.body;
    
    if (!firstName || !lastName || !age || !gender || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingStudent = await Student.findOne({
      email,
      _id: { $ne: req.params.id }
    });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, age, gender, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};