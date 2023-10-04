const CreateThread = require('../CreateThread');

describe('CreateThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'sebuah thread',
            owner: 'dicoding',
        };

        // Action and Assert
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 12345,
            body: true,
            owner: 'dicoding',
        };

        // Action and Assert
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when title contains more than 50 character', () => {
        // Arrange
        const payload = {
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            body: 'sebuah body thread',
            owner: 'dicoding',
        };

        // Action and Assert
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.TITLE_LIMIT_CHAR');
    });

    it('should create new thread object correctly', () => {
        // Arrange
        const payload = {
            title: 'sebuah thread',
            body: 'sebuah body thread',
            owner: 'dicoding',
        };

        // Action
        const { title, body, owner } = new CreateThread(payload);

        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
    });
});
