const { deleteCommentById, adjustCommentVotes } = require("../models/comments.models")

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then((deletedComment) => res.status(204).send({ deletedComment }))
    .catch(next);
};

exports.updateCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  adjustCommentVotes(comment_id, inc_votes)
    .then((comment) => res.status(200).send({ comment }))
    .catch(next);
};