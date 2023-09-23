const CommentRepository = require("../../Domains/comments/CommentRepository");
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async createComment(newComment) {
        const { content, thread, owner } = newComment;
        const id = `comment-_pby2_${this._idGenerator()}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: `INSERT INTO comments
                   VALUES($1, $2, $3, $4, $5, $6)
                   RETURNING id, content, owner`,
            values: [id, thread, content, owner, createdAt, updatedAt],
        };

        const result = await this._pool.query(query);

        return new CreatedComment({ ...result.rows[0] });
    }
}

module.exports = CommentRepositoryPostgres;