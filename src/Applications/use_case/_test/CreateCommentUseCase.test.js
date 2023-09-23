const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreateCommentUseCase = require('../CreateCommentUseCase');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');

describe('CreateCommentUseCase', () => {
    it('should orchestrating the create comment action correctly', async () => {
        const useCasePayload = {
            thread: 'thread-h_12345',
            content: 'sebuah comment',
            owner: 'userforum-12345',
        };

        const expectedCreatedComment = new CreatedComment({
            id: 'comment-_user12345',
            content: 'sebuah comment',
            owner: 'userforum-12345',
        });

        const mockCommentRepository = new CommentRepository();

        mockCommentRepository.createComment = jest.fn().mockImplementation(() => Promise.resolve(expectedCreatedComment));

        const getCommentUseCase = new CreateCommentUseCase({
            commentRepository: mockCommentRepository,
        });

        const createdComment = await getCommentUseCase.execute(useCasePayload);

        expect(createdComment).toStrictEqual((expectedCreatedComment));
        expect(mockCommentRepository.createComment).toBeCalledWith(new CreateComment({
            thread: useCasePayload.thread,
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        }));
    });
});