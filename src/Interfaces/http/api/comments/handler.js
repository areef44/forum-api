const CreateCommentUseCase = require("../../../../Applications/use_case/CreateCommentUseCase");
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

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

    async deleteCommentHandler(request, h) {
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        const { id: owner } = request.auth.credentials;
        const thread = request.params.threadId;
        const comment = request.params.commentId;
        const useCasePayload = {
            thread,
            comment,
            owner,
        };
        await deleteCommentUseCase.execute(useCasePayload);

        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = CommentHandler;

module.exports = CommentHandler;