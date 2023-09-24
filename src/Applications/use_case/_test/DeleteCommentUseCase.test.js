const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    it('should throw error when use case payload not contain thread id and comment id', async () => {
        const useCasePayload = {};
        const deleteCommentUseCase = new DeleteCommentUseCase({});

        await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    });

    it('should throw error if payload not string', async () => {
        // Arrange
        const useCasePayload = {
          thread: 23432,
          comment: 324234,
          owner: 4234324,
        };
        const deleteCommentUseCase = new DeleteCommentUseCase({});
    
        // Action & Assert
        await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the delete comment when action correctly', async () => {
        // Arrange
        const useCasePayload = {
          thread: 'thread-h_654321',
          comment: 'comment-_pby2_654321',
          owner: 'user_654321',
        };
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();
    
        mockThreadRepository.checkAvailabilityThread = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());
    
        const deleteCommentUseCase = new DeleteCommentUseCase({
          threadRepository: mockThreadRepository,
          commentRepository: mockCommentRepository,
        });
    
        // Action
        await deleteCommentUseCase.execute(useCasePayload);
    
        // Assert
        expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(useCasePayload.thread);
        expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(useCasePayload.comment);
        expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(useCasePayload.comment, useCasePayload.owner);
        expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.comment);
      });
});