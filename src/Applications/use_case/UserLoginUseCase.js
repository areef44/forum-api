const UserLogin = require('../../Domains/users/entities/UserLogin');
const MakeAuthentication = require('../../Domains/authentications/entities/MakeAuth');

class UserLoginUseCase {
    constructor({
        userRepository,
        authenticationRepository,
        authenticationTokenManager,
        passwordHash,
    }) {
        this._userRepository = userRepository;
        this._authenticationRepository = authenticationRepository;
        this._authenticationTokenManager = authenticationTokenManager;
        this._passwordHash = passwordHash;
    }

    async execute(useCasePayload) {
        const { username, password } = new UserLogin(useCasePayload);

        const encryptedPassword = await this._userRepository.getPasswordByUsername(username);
        
        await this._passwordHash.comparePassword(password, encryptedPassword);

        const id = await this._userRepository.getIdByUsername(username);

        const accessToken = await this._authenticationTokenManager.createAccessToken({ username, id });

        const refreshToken = await this._authenticationTokenManager.createRefreshToken({ username, id });

        const makeAuthentication = new MakeAuthentication({
            accessToken,
            refreshToken,
        });

        await this._authenticationRepository.addToken(makeAuthentication.refreshToken);

        return makeAuthentication;
    }
}

module.exports = UserLoginUseCase;