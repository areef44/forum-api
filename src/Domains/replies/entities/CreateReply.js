class CreateReply {
    constructor(payload) {
        this._verifyPayload(payload);

        const { content, owner, comment } = payload;

        this.content = content;
        this.owner = owner;
        this.comment = comment;
    }

    _verifyPayload(payload) {
        const { content, owner, comment } = payload;

        if(!content || !owner || !comment ) {
            throw new Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof owner !== 'string' || typeof comment !== 'string') {
            throw new Error('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CreateReply;