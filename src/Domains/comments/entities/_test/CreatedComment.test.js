const CreatedComment = require('../CreatedComment');

describe ('CreatedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'Ini Komentar',
        };

        // Action & Assert
        expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: ['hello world'],
            owner: 'user-123',
        };

        // Action & Assert
        expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create new comment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-_user123',
            content: 'sebuah comment',
            owner: 'dicoding',
        }

        // Action
        const createdComment = new CreatedComment(payload);

        // Assert
        expect(createdComment.id).toEqual(payload.id);
        expect(createdComment.content).toEqual(payload.content);
        expect(createdComment.owner).toEqual(payload.owner);
    });
});