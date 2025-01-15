const mongoose = require("mongoose");
const { Schema } = mongoose;

// Validator function to ensure a minimum number of options
function arrayLimit(val) {
  return val.length >= 2;
}

// Validator function to ensure correctAnswer is within the valid index range of options
function validateAnswerIndex(val) {
  return this.options && val >= 0 && val < this.options.length;
}

const quizSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        validate: [arrayLimit, "Each question should have at least two options."],
      },
      correctAnswer: {
        type: Number,
        required: true,
        validate: [validateAnswerIndex, "Correct answer must be a valid index in options."],
      },
    },
  ],
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  scores: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      score: {
        type: Number,
        default: 0, // Default score if not specified
      },
    },
  ],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Quiz", quizSchema);