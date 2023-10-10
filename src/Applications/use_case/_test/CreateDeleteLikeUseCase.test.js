const CreateDeleteLikeUseCase = require('../CreateDeleteLikeUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('Create and Delete Like Use Case', () => {
    it('should orchestrating the create like action correctly when like doesnt exist', async () => {
        // Arrange
        const useCasePayload = {
          threadId: 'thread-123',
          commentId: 'comment-123',
          owner: 'user-123',
        };
    
        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();
    
        /** mocking needed function */
        mockThreadRepository.checkAvailabilityThread = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn().mockImplementation(() => Promise.resolve());
        mockLikeRepository.verifyLikeIsExist = jest.fn().mockImplementation(() => Promise.resolve(false)); // like does not exist
        mockLikeRepository.createLike = jest.fn().mockImplementation(() => Promise.resolve());
    
        /** creating use case instance */
        const createDeleteLikeUseCase = new CreateDeleteLikeUseCase({
          threadRepository: mockThreadRepository,
          commentRepository: mockCommentRepository,
          likeRepository: mockLikeRepository,
        });
    
        // Action
        await createDeleteLikeUseCase.execute(useCasePayload);
    
        // Assert
        expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
        expect(mockLikeRepository.verifyLikeIsExist)
          .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockLikeRepository.createLike)
          .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
      });

      it('should orchestrating the delete like action correctly when like does already exist', async () => {
        // Arrange
        const useCasePayload = {
          threadId: 'thread-123',
          commentId: 'comment-123',
          owner: 'user-123',
        };
    
        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();
    
        /** mocking needed function */
        mockThreadRepository.checkAvailabilityThread = jest.fn()
          .mockImplementation(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn()
          .mockImplementation(() => Promise.resolve());
        mockLikeRepository.verifyLikeIsExist = jest.fn()
          .mockImplementation(() => Promise.resolve(true)); // like already exist
        mockLikeRepository.deleteLike = jest.fn()
          .mockImplementation(() => Promise.resolve());
    
        /** creating use case instance */
        const createDeleteLikeUseCase = new CreateDeleteLikeUseCase({
          threadRepository: mockThreadRepository,
          commentRepository: mockCommentRepository,
          likeRepository: mockLikeRepository,
        });
    
        // Action
        await createDeleteLikeUseCase.execute(useCasePayload);
    
        // Assert
        expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
        expect(mockLikeRepository.verifyLikeIsExist)
          .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockLikeRepository.deleteLike)
          .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
      });
});