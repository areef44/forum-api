const CreateThreadUseCase = require('../../../../Applications/use_case/CreateThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/DetailThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const createThreadUseCase = this._container.getInstance(CreateThreadUseCase.name);
        const { id: owner } = request.auth.credentials;
        const useCasePayload = {
            title: request.payload.title,
            body: request.payload.body,
            owner,
        };
        const addedThread = await createThreadUseCase.execute(useCasePayload);

        return h.response({
            status: 'success',
            data: {
                addedThread,
            },
        }).code(201);
    }

    async getDetailThreadHandler(request, h) {
        const { threadId } = request.params;
        const showThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
        const shownThread = await showThreadUseCase.execute(threadId);

        const response = h.response({
          status: 'success',
          data: { thread: shownThread },
        });
        response.code(200);
        return response;
    }
}

module.exports = ThreadsHandler;
