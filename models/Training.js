const mongoose = require("mongoose");
const ExerciseData = require("../interface/ExerciseData");

const TrainingSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    //  exercise:{
    //    type: ExerciseData,
    //  },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Training", TrainingSchema);
