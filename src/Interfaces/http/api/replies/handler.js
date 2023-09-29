const CreateReplyUseCase = require('../../../../Applications/use_case/CreateReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { content } = request.payload;
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const createReplyUseCase = this._container.getInstance(CreateReplyUseCase.name);
    const addedReply = await createReplyUseCase.execute({
      content, owner: userId, threadId, commentId,
    });

    const response = h.response({
      status: 'success',
      data: { addedReply },
    });
    response.code(201);
    return response;
  }
}

module.exports = RepliesHandler;