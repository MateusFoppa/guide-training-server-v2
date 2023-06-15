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
    const exercise = await Exercise.find({}, { trainingBy: 0, charge: 0, movements: 0 }).sort("createdAt");
    res.status(StatusCodes.OK).json({ exercise, count: exercise.length });
  }

  // Mostra por id
  async show(req, res) {
    console.log( req)

    // const { _id } = req.params;
    // const training = await Training.findOne({ _id });

    // if (!training) {
    //   return res.status(404).json();
    // }

    // return res.json(training);
    res.send("show");
  }

  async create(req, res) {
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

    req.body.trainingBy = trainingId;

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
    exerciseClone.trainingBy = trainingId;

    const exercise = await Exercise.create(exerciseClone);
    return res.status(StatusCodes.CREATED).json(exercise);
  }

  async update(req, res) {
    const {
      body: { name, image, description, series, charge, movements},
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