const { deleteCommentById } = require("../models/comments.models")

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then((deletedComment) => res.status(204).send({ deletedComment }))
    .catch(next);
};