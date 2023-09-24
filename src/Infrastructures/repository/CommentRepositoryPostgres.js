const NotFoundError = require("../../Commons/exceptions/NotFoundError");
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

    async checkAvailabilityComment(comment) {
        const query = {
            text:  `SELECT * FROM comments
                    WHERE id = $1`,
            values: [comment],
        };

        const result = await this._pool.query(query);

        if(result.rows.length === 0) {
            throw new NotFoundError('Comment has not found');
        }
    }

    async verifyCommentOwner(comment, owner) {
        const query = {
            text: `SELECT * FROM comments
                   WHERE id = $1
                   AND owner = $2`,
            values: [comment, owner],
        };

        const result = await this._pool.query(query);

        if(result.rows.length === 0) {
            throw new AuthorizationError('Sorry, You Cant delete this comment');
        }
    }

    async deleteComment(comment) {
        const query = {
            text:  `DELETE FROM comments
                    WHERE id = $1`,
            values: [comment],
        };

        await this._pool.query(query);
    }
}

module.exports = CommentRepositoryPostgres;