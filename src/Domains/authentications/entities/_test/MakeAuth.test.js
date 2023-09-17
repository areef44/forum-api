const MakeAuth = require('../MakeAuth');

describe('MakeAuth entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            accessToken: 'accessToken',
        };

        // Action & Assert
        expect(() => new MakeAuth(payload)).toThrowError('MAKE_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            accessToken: 'accessToken',
            refreshToken: 1234,
        };

        //Action & Assert
        expect(() => new MakeAuth(payload)).toThrowError('MAKE_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create MakeAuth entities correctly', () => {
        // Arrange
        const payload = {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
        };

        // Action
        const makeAuth = new MakeAuth(payload);

        // Assert
        expect(makeAuth).toBeInstanceOf(MakeAuth);
        expect(makeAuth.accessToken).toEqual(payload.accessToken);
        expect(makeAuth.refreshToken).toEqual(payload.refreshToken);
    });
});