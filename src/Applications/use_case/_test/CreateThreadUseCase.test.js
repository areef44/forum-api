const CreatedThreat = require('../../../Domains/threads/entities/CreatedThread');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreateThreadUseCase = require('../CreateThreadUseCase');

describe('CreateThreadUseCase', () => {
    it('should orchestrating the create thread action correctly', async () =>{
        // Arrange
        const useCasePayload = {
            title: 'sebuah thread',
            body: 'body sebuah thread',
            owner: 'user-forum-123',
        };
        const expectedCreatedThread = new CreatedThreat({
            id: 'thread-h_123',
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner,
        });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());

        mockThreadRepository.createThread = jest.fn().mockImplementation(() => Promise.resolve(expectedCreatedThread));

        const getThreadUseCase = new CreateThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const createdThread = await getThreadUseCase.execute(useCasePayload);

        // Assert
        expect(createdThread).toStrictEqual(expectedCreatedThread);
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.title);
        expect(mockThreadRepository.createThread).toBeCalledWith(new CreateThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner,
        }));

    });
});