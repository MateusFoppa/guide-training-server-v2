const { Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
const Training = require("../models/Training");
const User = require("../models/User");
const Exercise = require("../models/Exercise");

class TrainingController {
  async index(req, res) {
    const training = await Training.findAll({
      where: { createdBy: req.user.userId },
      order: [["createdAt", "ASC"]],
    });
    res.status(StatusCodes.OK).json({ training, count: training.length });
  }

  async indexList(req, res) {
    const adminId = "648de025365b5504ac3901fe";
    const training = await Training.findAll({
      where: { createdBy: adminId },
      attributes: { exclude: ["createdBy"] },
      order: [["createdAt", "ASC"]],
    });
    res.status(StatusCodes.OK).json({ training, count: training.length });
  }

  async show(req, res) {
    const { trainingId } = req.params;
    const training = await Training.findByPk(trainingId);

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
    const trainingClone = await Training.findByPk(trainingId);
    if (!trainingClone) {
      throw new CustomAPIError.BadRequestError("Training not defined");
    }

    const { name } = trainingClone;
    const { userId } = req.user;

    const exerciseClone = await Exercise.findAll({
      where: { trainingBy: trainingId },
      attributes: { exclude: ["charge", "id"] },
      order: [["createdAt", "ASC"]],
    });

    console.log(exerciseClone.length);

    const training = await Training.create({
      name,
      createdBy: userId,
      Exercises: exerciseClone,
    });

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

    const [affectedRows] = await Training.update(req.body, {
      where: { id: trainingId, createdBy: userId },
    });

    if (affectedRows === 0) {
      throw new NotFoundError(`No Training with id ${trainingId}`);
    }

    const updatedTraining = await Training.findByPk(trainingId);
    res.status(StatusCodes.OK).json({ training: updatedTraining });
  }

  async destroy(req, res) {
    const {
      user: { userId },
      params: { trainingId },
    } = req;

    const affectedRows = await Training.destroy({
      where: { id: trainingId, createdBy: userId },
    });

    if (affectedRows === 0) {
      throw new NotFoundError(`No Training with id ${trainingId}`);
    }

    res.status(StatusCodes.OK).send();
  }
}

module.exports = new TrainingController();
