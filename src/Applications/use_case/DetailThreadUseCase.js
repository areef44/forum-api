class DetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
        this._likeRepository = likeRepository;
  }

    async execute(useCasePayload) {
        const thread = await this._threadRepository.getDetailThread(useCasePayload);
        const comments = await this._commentRepository.getCommentsThread(useCasePayload);
        const replies = await this._replyRepository.getRepliesByThreadId(useCasePayload);
        const validatedComments = this._validateDeletedComment(comments);
        const validatedReplies = this._validateDeletedReply(replies);
        const commentsWithReplies = this._addReplyToComment(validatedComments, validatedReplies);
        const commentsWithRepliesAndLikesCount = await this._createLikeCountToComment(commentsWithReplies);
        return {
        ...thread,
        comments: commentsWithRepliesAndLikesCount,
        };
    }

    _validateDeletedComment(comments) {
        for (const comment of comments) {
          if (comment.is_deleted) {
            comment.content = '**komentar telah dihapus**';
          }
          delete comment.is_deleted;
        }
        return comments;
    }

    _validateDeletedReply(replies) {
      for (const reply of replies) {
        if (reply.is_delete) {
          reply.content = '**balasan telah dihapus**';
        }
        delete reply.is_delete;
      }
      return replies;
    }

     _addReplyToComment(comments, replies) {
    for (const comment of comments) {
      comment.replies = [];
      for (const reply of replies) {
        if (reply.comment_id === comment.id) {
          comment.replies.push(reply);
        }
        delete reply.comment_id;
      }
    }
    return comments;
    }

    async _createLikeCountToComment(comments) {
      // eslint-disable-next-line no-restricted-syntax
      for (const comment of comments) {
        // eslint-disable-next-line no-await-in-loop
        comment.likeCount = await this._likeRepository.getLikeCount(comment.id);
      }
      return comments;
    }
}

module.exports = DetailThreadUseCase;
