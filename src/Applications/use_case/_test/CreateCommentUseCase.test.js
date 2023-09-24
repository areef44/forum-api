const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreateCommentUseCase = require('../CreateCommentUseCase');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('CreateCommentUseCase', () => {
    it('should orchestrating the create comment action correctly', async () => {
        const useCasePayload = {
            thread: 'thread-h_123',
            content: 'sebuah comment',
            owner: 'user-123',
        };

        const expectedCreatedComment = new CreatedComment({
            id: 'comment-_user123',
            content: 'sebuah comment',
            owner: 'user-123',
        });

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.checkAvailabilityThread = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.createComment = jest.fn().mockImplementation(() => Promise.resolve(expectedCreatedComment));

        const getCommentUseCase = new CreateCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        const createdComment = await getCommentUseCase.execute(useCasePayload);

        expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.thread);
        expect(createdComment).toStrictEqual((expectedCreatedComment));
        expect(mockCommentRepository.createComment).toBeCalledWith(new CreateComment({
            thread: useCasePayload.thread,
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        }));
    });
});