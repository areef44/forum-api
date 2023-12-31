const CreateThread = require('../../Domains/threads/entities/CreateThread');

class CreateThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const newThread = new CreateThread(useCasePayload);
        return this._threadRepository.createThread(newThread);
    }
}

module.exports = CreateThreadUseCase;
