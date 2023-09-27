const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
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
            text:  `SELECT * FROM comments
                    WHERE id = $1`,
            values: [comment],
        };

        const result = await this._pool.query(query);

        if(result.rows.length === 0) {
            throw new NotFoundError('komentar tidak ditemukan di database');
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
            throw new AuthorizationError('anda tidak bisa menghapus komentar orang lain.');
        }
    }

    async deleteComment(comment) {
        const query = {
            text:  `UPDATE comments
                    SET is_deleted=TRUE
                    WHERE id = $1`,
            values: [comment],
        };

        await this._pool.query(query);
    }

    async getCommentsThread(thread) {
        const query = {
            text: `SELECT comments.id, users.username, comments.created_at as date, comments.content, comments.is_deleted FROM comments LEFT JOIN users ON users.id = comments.owner WHERE thread = $1 ORDER BY comments.created_at ASC`,
            values: [thread],
        };

        const comments = await  this._pool.query(query);
        const result = [];
        comments.rows.forEach((data) => {
            const comment = {
                id: data.id,
                username: data.username,
                date: data.date,
                content: data.content
            };
            if (data.is_deleted > 0) {
                comment.content = 'comment has been deleted';
            }
            result.push(comment);
        });
        return result;
    }
}

module.exports = CommentRepositoryPostgres;