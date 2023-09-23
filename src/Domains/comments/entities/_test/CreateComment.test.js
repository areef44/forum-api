const CreateComment = require('../CreateComment');

describe('CreateComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            thread: 'thread-h_12345',
            owner: 'userforum-12345',
        };

        expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
          thread: 'thread-h_12345',
          owner: 'userforum-12345',
          content: false,
        };
    
        expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      });

    it('should create new comment object correctly', () => {
        const payload = {
          thread: 'thread-h_12345',
          owner: 'userforum-123',
          content: 'sebuah comment',
        };
    
        const { content, thread, owner } = new CreateComment(payload);
    
        expect(content).toEqual(payload.content);
        expect(thread).toEqual(payload.thread);
        expect(owner).toEqual(payload.owner);
    });
});