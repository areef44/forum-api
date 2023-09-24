const CreateCommentUseCase = require("../../../../Applications/use_case/CreateCommentUseCase");

class CommentHandler {
    constructor(container) {
        this._container = container;
        
        this._postCommentHandler = this.postCommentHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const createCommentUseCase = this._container.getInstance(CreateCommentUseCase.name);
        const { id : owner } = request.auth.credentials;
        const thread = request.params.threadId;
        const useCasePayload = {
            content: request.payload.content,
            thread,
            owner,
        };
        const addedComment = await createCommentUseCase.execute(useCasePayload);

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }
}

module.exports = CommentHandler;