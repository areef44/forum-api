const UserLoginUseCase = require('../../../../Applications/use_case/UserLoginUseCase');
const RefreshAuthenticationUseCase = require('../../../../Applications/use_case/RefreshAuthenticationUseCase');
const UserLogoutUseCase = require('../../../../Applications/use_case/UserLogoutUseCase');

class AuthenticationsHandler {
    constructor(container) {
        this._container = container;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }

    async postAuthenticationHandler(request, h) {
        const loginUserUseCase = this._container.getInstance(UserLoginUseCase.name);
        const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload);
        return h.response({
            status: 'success',
            data: {
                accessToken,
                refreshToken,
            },
        }).code(201);
    }

    async putAuthenticationHandler(request) {
        const refreshAuthenticationUseCase = this._container.getInstance(RefreshAuthenticationUseCase.name);
        const accessToken = await refreshAuthenticationUseCase.execute(request.payload);

        return {
            status: 'success',
            data: {
                accessToken,
            },
        };
    }

    async deleteAuthenticationHandler(request) {
        const logoutUserUseCase = this._container.getInstance(UserLogoutUseCase.name);
        await logoutUserUseCase.execute(request.payload);
        return {
          status: 'success',
        };
    }
}

module.exports = AuthenticationsHandler;
