const CreateComment = require('../../Domains/comments/entities/CreateComment');

class CreateCommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const newComment = new CreateComment(useCasePayload);
        return this._commentRepository.createComment(newComment);
    }
}

module.exports = CreateCommentUseCase;