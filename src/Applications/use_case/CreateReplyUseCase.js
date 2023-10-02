const CreateReply = require('../../Domains/replies/entities/CreateReply');

class CreateReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        await this._threadRepository.checkAvailabilityThread(useCasePayload.threadId);
        await this._threadRepository.getDetailThread(useCasePayload.threadId);
        await this._commentRepository.checkAvailabilityComment(useCasePayload.commentId);
        const createReply = new CreateReply(useCasePayload);
        return this._replyRepository.createReply(createReply);
    }
}

module.exports = CreateReplyUseCase;
