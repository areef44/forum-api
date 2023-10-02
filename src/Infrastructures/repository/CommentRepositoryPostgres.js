const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

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

        const query = {
            text: `INSERT INTO comments
                   VALUES($1, $2, $3, $4, FALSE, $5, $5)
                   RETURNING id, content, owner`,
            values: [id, thread, content, owner, createdAt],
        };

        const result = await this._pool.query(query);

        return new CreatedComment(result.rows[0]);
    }

    async checkAvailabilityComment(comment) {
        const query = {
            text: `SELECT * FROM comments
                   WHERE id = $1`,
            values: [comment],
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('komentar tidak ditemukan');
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

        if (result.rowCount === 0) {
            throw new AuthorizationError('kamu tidak bisa menghapus komentar punya orang lain.');
        }
    }

    async deleteComment(comment) {
        const query = {
            text: `UPDATE comments
                   SET is_deleted=TRUE
                   WHERE id = $1`,
            values: [comment],
        };

        await this._pool.query(query);
    }

    async getCommentsThread(thread) {
        const query = {
            text: `SELECT c.id, u.username, c.created_at as date, c.content, c.is_deleted 
            FROM comments c
            LEFT JOIN users u ON u.id = c.owner
            WHERE thread = $1
            ORDER BY c.created_at ASC`,
            values: [thread],
        };

        const { rows } = await this._pool.query(query);

        return rows;
    }
}

module.exports = CommentRepositoryPostgres;
