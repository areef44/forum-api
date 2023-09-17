const UserLogin = require('../UserLogin');

describe('UserLogin entities', () => {
    it('should throw error when payload does not contain needed property', () => {
        // Arrange
        const payload = {
            username: 'dicoding',
        };

        // Action & Assert
        expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            username: '12345',
            password: 12345,
        };

        // Action & Assert
        expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create UserLogin entities correctly', () => {
        // Arrange
        const payload = {
            username: 'dicoding',
            password: 'abc',
        };

        // Action
        const { username, password } = new UserLogin(payload);

        // Assert

        expect(username).toEqual(payload.username);
        expect(password).toEqual(payload.password);
    });
});

