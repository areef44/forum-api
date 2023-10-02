const CreatedThread = require('../CreatedThread');

describe('CreatedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'sebuah thread',
            owner: 'dicoding',
        };

        // Action & Assert
        expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            title: {},
            owner: 'user-12345',
        };

        // Action & Assert
        expect(() => new CreatedThread(payload).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'));
    });

    it('should create new thread object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-user1',
            title: 'sebuah thread',
            owner: 'dicoding',
        };

        // Action
        const createThread = new CreatedThread(payload);

        // Assert
        expect(createThread.id).toEqual(payload.id);
        expect(createThread.title).toEqual(payload.title);
        expect(createThread.body).toEqual(payload.body);
        expect(createThread.owner).toEqual(payload.owner);
    });
});
