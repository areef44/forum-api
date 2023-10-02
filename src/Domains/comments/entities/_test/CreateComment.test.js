const CreateComment = require('../CreateComment');

describe('CreateComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'sebuah comment',
        };

        expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
          content: 12345,
          owner: { id: 'user-123' },
          thread: 'thread-123',
        };

        expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      });

    it('should create new comment object correctly', () => {
        const payload = {
          content: 'First comment!',
          owner: 'user-123',
          thread: 'thread-123',
        };

        const createComment = new CreateComment(payload);

        expect(createComment).toBeInstanceOf(CreateComment);
        expect(createComment.content).toEqual(payload.content);
        expect(createComment.owner).toEqual(payload.owner);
    });
});
