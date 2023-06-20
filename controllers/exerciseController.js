const Exercise = require("../models/Exercise");
const Training = require("../models/Training");
const { Op } = require("sequelize");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

class ExerciseController {
  async index(req, res) {
    const { trainingId } = req.params;
    
    const training = await Training.findOne({
      where: {
        id: trainingId,
        createdBy: req.user.userId,
      },
    });

    if (!training) {
      return res.status(StatusCodes.OK).json({ msg: 'Training no match for User' });
    }

    const exercises = await Exercise.findAll({
      where: {
        trainingBy: trainingId,
      },
      order: [['createdAt', 'ASC']],
    });

    res.status(StatusCodes.OK).json({ exercises, count: exercises.length });
  }

  async indexList(req, res) {
    const adminId = '1';

    const exercises = await Exercise.findAll({
      where: {
        createdBy: adminId,
      },
      attributes: { exclude: ['trainingBy', 'charge', 'movements'] },
      order: [['createdAt', 'ASC']],
    });
    res.status(StatusCodes.OK).json({ exercises, count: exercises.length });
  }

  async show(req, res) {
    const { exerciseId } = req.params;

    const exercise = await Exercise.findByPk(exerciseId);

    if (!exercise) {
      return res.status(404).json();
    }

    return res.status(StatusCodes.OK).json(exercise);
  }

  async create(req, res) {
    const { trainingId } = req.params;
    const { userId } = req.user;

    const training = await Training.findOne({
      where: {
        id: trainingId,
        createdBy: userId,
      },
    });

    if (!training) {
      return res.status(StatusCodes.OK).json({ msg: 'Training no match for User' });
    }

    req.body.trainingBy = trainingId;
    req.body.createdBy = userId;

    const exercise = await Exercise.create(req.body);
    return res.status(StatusCodes.CREATED).json(exercise);
  }

  async clone(req, res) {
    const { trainingId, exerciseId } = req.params;

    const training = await Training.findOne({
      where: {
        id: trainingId,
        createdBy: req.user.userId,
      },
    });

    if (!training) {
      return res.status(StatusCodes.OK).json({ msg: 'Training no match for User' });
    }

    const exerciseClone = await Exercise.findByPk(exerciseId);

    if (!exerciseClone) {
      throw new BadRequestError('Exercise not defined');
    }

    const { name, image, description, series, movements } = exerciseClone;

    const exercise = await Exercise.create({
      name,
      image,
      description,
      series,
      movements,
      trainingBy: trainingId,
      createdBy: req.user.userId,
    });

    return res.status(StatusCodes.CREATED).json(exercise);
  }

  async update(req, res) {
    const {
      movements,
      series,
      charge,
      name,
      image,
      description,
    } = req.body;

console.log(req.body);

    const { userId } = req.user;
    const { exerciseId, trainingId } = req.params;

    if (!series || !charge || !movements) {
      throw new BadRequestError('Insert information for exercise');
    }

    const training = await Training.findOne({
      where: {
        id: trainingId,
        createdBy: userId,
      },
    });

    if (!training) {
      return res.status(StatusCodes.OK).json({ msg: 'Training no match for User' });
    }

    const [updatedRows] = await Exercise.update(
      {
        name: name,
        image: image,
        description: description,
        series: series,
        movements: movements,
        charge: charge
      },
      {
        where: {
          id: exerciseId,
          trainingBy: trainingId,
        },
        returning: true,
      }
    );

    if (updatedRows === 0) {
      throw new NotFoundError(`No Exercise with id ${exerciseId}`);
    }

    const exercise = await Exercise.findByPk(exerciseId);

    res.status(StatusCodes.OK).json({ exercise });
  }

  async destroy(req, res) {
    const { userId } = req.user;
    const { exerciseId, trainingId } = req.params;

    const exercise = await Exercise.destroy({
      where: {
        id: exerciseId,
        trainingBy: trainingId,
      },
    });

    if (!exercise) {
      throw new NotFoundError(`No Exercise with id ${exerciseId}`);
    }

    res.status(StatusCodes.OK).send();
  }
}

module.exports = new ExerciseController();
