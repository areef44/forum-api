const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
    it('should get return detail thread correctly', async () => {
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
            content: 'sebuah comment',
            is_deleted: 0,
          },
          {
            id: 'comment-123456',
            username: 'dicoding',
            date: '2023-09-28T08:55:26.521Z',
            content: 'sebuah comment',
            is_deleted: 1,
          },
        ];
    
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
    
        mockThreadRepository.checkAvailabilityThread = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.getDetailThread = jest.fn().mockImplementation(() => Promise.resolve(expectedThread));
        mockCommentRepository.getCommentsThread = jest.fn()
          .mockImplementation(() => Promise.resolve(expectedComment));
    
        const detailThreadUseCase = new DetailThreadUseCase({
          threadRepository: mockThreadRepository,
          commentRepository: mockCommentRepository,
        });
    
        await detailThreadUseCase.execute(useCasePayload);
        const detailThread = await detailThreadUseCase.execute(useCasePayload);
    
        expect(mockThreadRepository.getDetailThread).toHaveBeenCalledWith(useCasePayload.thread);
        expect(mockCommentRepository.getCommentsThread).toHaveBeenCalledWith(useCasePayload.thread);
        expect(detailThread).toStrictEqual({
          thread: {
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
            content: 'sebuah comment',
          },
          {
            id: 'comment-123456',
            username: 'dicoding',
            date: '2023-09-28T08:55:26.521Z',
            content: '**komentar telah dihapus**',
          },
        ],
      },
    });
  });
});