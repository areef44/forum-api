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
        }
        const addedThread = await createThreadUseCase.execute(useCasePayload);
        
        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getDetailThreadHandler(request, h) {
        const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
        const useCasePayload = {
          thread: request.params.threadId,
        };
        const { thread, comments } = await detailThreadUseCase.execute(useCasePayload);
        thread.comments = comments;
        const response = h.response({
          status: 'success',
          data: {
            thread,
          },
        });
        response.code(200);
        return response;
    }
}

module.exports = ThreadsHandler;