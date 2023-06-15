const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  image: String,
  series: Number,
  charge: Number,
  movements: Number,
  description: String,
  trainingBy: {
    type: mongoose.Types.ObjectId,
    ref: "Training",
    required: [true, "Please provide Training"],
  },
});

module.exports = mongoose.model("Exercise", ExerciseSchema);
