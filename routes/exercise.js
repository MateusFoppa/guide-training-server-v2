const express = require("express");
const authenticateUserRole = require("../middleware/roleAuthentication");

const router = express.Router();
const {
  create,
  index,
  update,
  show,
  destroy,
  indexList,
  clone
} = require("../controllers/exerciseController");

router.route("/training/:trainingId").post(authenticateUserRole, create).get(index);

router
  .route("/:exerciseId/training/:trainingId")
  .get(show)
  .put(update)
  .delete(destroy)
  .post(clone);

  router.route('/list').get(indexList)

  router.route('/:exerciseId').get(show)



module.exports = router;
