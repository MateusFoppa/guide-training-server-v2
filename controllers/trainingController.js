const Training = require("../models/Training");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const User = require("../models/User");

class TrainingController {
  // Mostra todos
  async index(req, res) {
    const training = await Training.find({ createdBy: req.user.userId }).sort(
      "createdAt"
    );
    res.status(StatusCodes.OK).json({ training, count: training.length });
  }

  async indexList(req, res) {
    const training = await Training.find({}, { createdBy: 0}).sort("createdAt");
    res.status(StatusCodes.OK).json({ training, count: training.length });
  }

  // Mostra por id
  async show(req, res) {
    // const { _id } = req.params;
    // const training = await Training.findOne({ _id });

    // if (!training) {
    //   return res.status(404).json();
    // }

    // return res.json(training);
    res.send("show");
  }

  async create(req, res) {
    req.body.createdBy = req.user.userId;

    const training = await Training.create(req.body);
    return res.status(StatusCodes.CREATED).json(training);
  }

  async clone(req, res) {
    const { trainingId } = req.params;
    const trainingClone = await Training.findById(trainingId)
    trainingClone.createdBy = req.user.userId;

    const training = await Training.create(trainingClone);
    return res.status(StatusCodes.CREATED).json(training);
  }

  async update(req, res) {
    const {
      body: { name },
      user: { userId },
      params: { trainingId },
    } = req;

    if (name === "") {
      throw new BadRequestError("Name or Exercise fields cannot be empty");
    }
     const training = await Training.findByIdAndUpdate(
        { _id: trainingId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
      );

    if (!training) {
      throw new NotFoundError(`No Training with id ${trainingId}`);
    }
    res.status(StatusCodes.OK).json({ training });
  }

  async destroy(req, res) {
    const {
      user: { userId },
      params: { trainingId },
    } = req;

    const training = await Training.findByIdAndRemove({
      _id: trainingId,
      createdBy: userId,
    });
    if (!training) {
      throw new NotFoundError(`No Training with id ${trainingId}`);
    }
    res.status(StatusCodes.OK).send();
  }
}

module.exports = new TrainingController();
