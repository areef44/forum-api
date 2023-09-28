const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class DetailThreadUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { thread } = new DetailThread(useCasePayload);
        await this._threadRepository.checkAvailabilityThread(thread);
        const detailThread = await this._threadRepository.getDetailThread(thread);
        const getCommentsThread = await this._commentRepository.getCommentsThread(thread);
        const commentPayload = {
            comments: getCommentsThread,
        };
        const resultComments = new DetailComment(commentPayload);
        detailThread.comments = resultComments.comments;
        const result = {
            thread: detailThread
        };
        return result;
    }
}
module.exports = DetailThreadUseCase;