const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DetailThreadUseCase', () => {
  it('should return detail thread correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-h_123456',
    };

    const expectedThread = {
      id: 'thread-h_123456',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023-09-28T08:55:26.521Z',
      username: 'dicoding',
    };

    const expectedComment = [
      {
        id: 'comment-123456',
        username: 'dicoding',
        date: '2023-09-28T08:55:26.521Z',
        content: 'sebuah comment 1',
        is_deleted: 0,
      },
      {
        id: 'comment-1234567',
        username: 'dicoding',
        date: '2023-09-28T08:55:26.521Z',
        content: 'sebuah comment 2',
        is_deleted: 1,
      },
    ];

    const expectedReplies = [
      {
        id: 'reply-1', //
        content: 'reply Content 1', //
        date: '2023-09-28T08:55:26.521Z', //
        username: 'dicoding',
        is_delete: false,
        comment_id: 'comment-123456',
      },
      {
        id: 'reply-2', //
        content: 'reply Content 2',
        date: '2023-09-28T08:55:26.521Z',
        username: 'dicoding',
        is_delete: true,
        comment_id: 'comment-123456',
      },
    ];

    const expectedShownThread = {
      id: 'thread-h_123456',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023-09-28T08:55:26.521Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123456',
          username: 'dicoding',
          date: '2023-09-28T08:55:26.521Z',
          replies: [
            {
              id: 'reply-1', //
              content: 'reply Content 1', //
              date: '2023-09-28T08:55:26.521Z',
              username: 'dicoding',
            },
            {
              id: 'reply-2', //
              content: '**balasan telah dihapus**', //
              date: '2023-09-28T08:55:26.521Z',
              username: 'dicoding',
            },
          ],
          content: 'sebuah comment 1',
        },
        {
          id: 'comment-1234567',
          username: 'dicoding',
          date: '2023-09-28T08:55:26.521Z',
          replies: [],
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // Mock repositories
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getDetailThread = jest.fn().mockResolvedValue(expectedThread);
    mockCommentRepository.getCommentsThread = jest.fn().mockResolvedValue(expectedComment);
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockResolvedValue(expectedReplies);

    // Create instance of DetailThreadUseCase with mock repositories
    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    const detailsThread = await detailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailsThread).toStrictEqual(expectedShownThread);
    expect(mockThreadRepository.getDetailThread).toHaveBeenCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsThread).toHaveBeenCalledWith(useCasePayload);
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(useCasePayload);
  });
});
