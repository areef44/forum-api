const CreateReplyUseCase = require('../CreateReplyUseCase');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('CreateReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the create reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'New Reply',
      owner: 'user-123',
      comment: 'comment-123',
    };
    const expectedCreatedReply = new CreatedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
    });
    
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment= jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.createReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedReply));

    /** creating use case instance */
    const createReplyUseCase = new CreateReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const createdReply = await createReplyUseCase.execute(useCasePayload);

    // Assert
    expect(createdReply).toStrictEqual(expectedCreatedReply);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.comment);
    expect(mockReplyRepository.createReply).toBeCalledWith(new CreateReply({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      comment: useCasePayload.comment,
    }));
  });
});