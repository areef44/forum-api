const CreateComment = require('../../Domains/comments/entities/CreateComment');

class CreateCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const { thread } = useCasePayload;
        await this._threadRepository.checkAvailabilityThread(thread);
        const newComment = new CreateComment(useCasePayload);
        return this._commentRepository.createComment(newComment);
    }
}

module.exports = CreateCommentUseCase;
