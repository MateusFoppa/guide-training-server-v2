const Exercise = require("../models/Exercise");
const Training = require("../models/Training");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

class ExerciseController {
  // Mostra todos
  async index(req, res) {
    const { trainingId } = req.params;
    // Recebe o id do training e procura no banco e verifica se pertence ao usuário logado
    const training = await Training.findOne({
        _id: trainingId,
        createdBy: req.user.userId,
      })

    // If para validação se TrainingId é de req.user.userId
    if (!training) {
        return res.status(StatusCodes.OK).json({ msg:'Training no match for User' });
    }

    const exercise = await Exercise.find({ trainingBy: trainingId }).sort(
      "createdAt"
    );
    res.status(StatusCodes.OK).json({ exercise, count: exercise.length });
  }

  async indexList(req, res) {
    const adminId = "648de025365b5504ac3901fe";
    const exercise = await Exercise.find({createdBy: adminId}, { trainingBy: 0, charge: 0, movements: 0 }).sort("createdAt");
    res.status(StatusCodes.OK).json({ exercise, count: exercise.length });
  }

  // Mostra por id
  async show(req, res) {
    const { exerciseId } = req.params;
    const exercise = await Exercise.findById({ _id: exerciseId });

    if (!exercise) {
      return res.status(404).json();
    }

    return res.status(StatusCodes.OK).json(exercise);
  }

  async create(req, res) {
    const { trainingId } = req.params;
    const { userId } = req.user;
    console.log(userId);
    // Recebe o id do training e procura no banco e verifica se pertence ao usuário logado
    const training = await Training.findOne({
        _id: trainingId,
        createdBy: userId,
      })

    // If para validação se TrainingId é de req.user.userId
    if (!training) {
      return res.status(StatusCodes.OK).json({ msg:'Training no match for User' });

    }

    req.body.trainingBy = trainingId;
    req.body.createdBy = userId;

    const exercise = await Exercise.create(req.body);
    return res.status(StatusCodes.CREATED).json(exercise);
  }

  async clone(req, res) {
    const { trainingId, exerciseId} = req.params;

    // Recebe o id do training e procura no banco e verifica se pertence ao usuário logado
    const training = await Training.findOne({
        _id: trainingId,
        createdBy: req.user.userId,
      })

    // If para validação se TrainingId é de req.user.userId
    if (!training) {
      return res.status(StatusCodes.OK).json({ msg:'Training no match for User' });
    }

    const exerciseClone = await Exercise.findById(exerciseId)

    if (!exerciseClone) {
      throw new CustomAPIError.BadRequestError('Exercise not defined')
     }

    const {name, image, description, series, movements } = exerciseClone;

    const exercise = await Exercise.create({name, image, description, series, movements, trainingBy: trainingId, createdBy: req.user.userId});
    return res.status(StatusCodes.CREATED).json(exercise);
  }

  async update(req, res) {
    const {
      body: { movements, series, charge,  name, image, description, },
      user: { userId },
      params: { exerciseId, trainingId },
    } = req
  
    if (name === '' || image === '' || description === '' || series === '' || charge === '' || movements === '' ) {
      throw new BadRequestError('Insert information for exercise')
    }

    // Recebe o id do training e procura no banco e verifica se pertence ao usuário logado
    const training = await Training.findOne({
      _id: trainingId,
      createdBy: req.user.userId,
    })

  // If para validação se TrainingId é de req.user.userId
  if (!training) {
    return res.status(StatusCodes.OK).json({ msg:'Training no match for User' });

  }
    const exercise = await Exercise.findByIdAndUpdate(
      { _id: exerciseId, trainingBy: trainingId },
      req.body,
      { new: true, runValidators: true }
    )
    if (!exercise) {
      throw new NotFoundError(`No Exercise with id ${exerciseId}`)
    }
    res.status(StatusCodes.OK).json({ exercise })
  }

  async destroy(req, res) {
    const {
      user: { userId },
      params: { exerciseId, trainingId },
    } = req
    
      const exercise = await Exercise.findByIdAndRemove({
        _id: exerciseId,
        trainingIdBy: trainingId,
      })
      if (!exercise) {
        throw new NotFoundError(`No Exercise with id ${exerciseId}`)
      }
      res.status(StatusCodes.OK).send()
    }
}

module.exports = new ExerciseController();