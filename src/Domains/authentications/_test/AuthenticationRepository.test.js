const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository interface', () => {
    it('should throw error when invoke not implemented method', async () => {
        const authenticationRepository = new AuthenticationRepository();

        await expect(authenticationRepository.addToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(authenticationRepository.checkAvailabilityToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(authenticationRepository.deleteToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});

