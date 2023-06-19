const Training = require("../models/Training");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
const User = require("../models/User");
const Exercise = require("../models/Exercise");

class TrainingController {
  // Mostra todos
  async index(req, res) {
    const training = await Training.find({ createdBy: req.user.userId }).sort(
      "createdAt"
    );
    res.status(StatusCodes.OK).json({ training, count: training.length });
  }

  async indexList(req, res) {
    const adminId = "648de025365b5504ac3901fe";
    const training = await Training.find({createdBy: adminId}, { createdBy: 0}).sort("createdAt");
    res.status(StatusCodes.OK).json({ training, count: training.length });
  }

  // Mostra por id
  async show(req, res) {
    const { trainingId } = req.params;
    const training = await Training.findById({ _id: trainingId });

    if (!training) {
      return res.status(404).json();
    }

    return res.status(StatusCodes.OK).json(training);
  }

  async create(req, res) {
    req.body.createdBy = req.user.userId;

    const training = await Training.create(req.body);
    return res.status(StatusCodes.CREATED).json(training);
  }

  async clone(req, res) {
    const { trainingId } = req.params;
    const trainingClone = await Training.findById(trainingId)
 if (!trainingClone) {
  throw new CustomAPIError.BadRequestError('Training not defined')
 }

    // desestruturar training e adicionar novo criador
    const { name } = trainingClone
    const { userId } = req.user
    
    const exerciseClone = await Exercise.find({trainingBy: trainingId}, { charge: 0, _id: 0 }).sort("createdAt");
    
    console.log(exerciseClone.length);

    // recria o treino e seus exercicios para o id logado,de momento será implementado somente para exercicios

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
