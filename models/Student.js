const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },
  gradeLevel: {
    type: String,
    required: false,
    default: "N/A"
  },
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  assignedTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }]
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;