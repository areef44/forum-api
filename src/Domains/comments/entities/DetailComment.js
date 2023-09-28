class DetailComment {
    constructor(payload) {
        this._verifyPayload(payload);
        const comments = this._mapComment(payload);
        this.comments = comments;
    }

    _verifyPayload({ comments}) {
        if(!comments) {
            throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if(!Array.isArray(comments)) {
            throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

    _mapComment({ comments }){
        const result = [];
        comments.forEach((data) => {
            const comment = {
                id: data.id,
                username: data.username,
                date: data.date,
                content: data.content
            };
            if (data.is_deleted > 0) {
                comment.content = '**komentar telah dihapus**';
            }
            result.push(comment);
        });
        return result;
    }
}

module.exports = DetailComment;