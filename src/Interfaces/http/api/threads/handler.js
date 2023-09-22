const CreateThreadUseCase = require('../../../../Applications/use_case/CreateThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const createThreadUseCase = this._container.getInstance(CreateThreadUseCase.name);
        const createdThread = await createThreadUseCase.execute(request.payload);

        const response = h.response({
            status: 'success',
            data: {
                createdThread,
            },
        });
        response.code(201);
        return response;
    }
}

module.exports = ThreadsHandler;