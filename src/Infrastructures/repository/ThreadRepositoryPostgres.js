const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const CreatedThread = require("../../Domains/threads/entities/CreatedThread");
const InvariantError = require('../../Commons/exceptions/InvariantError');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator
    }

    async createThread(newThread) {
        const { title, body, owner } = newThread;
        const id = `thread-h_${this._idGenerator()}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: `INSERT INTO threads
                   VALUES ($1, $2, $3 , $4, $5, $6)
                   RETURNING id, title, owner`,
            values: [id, title, body, owner, createdAt, updatedAt],
        };

        const result = await this._pool.query(query);

        return new CreatedThread({...result.rows[0]});
    }
}

module.exports = ThreadRepositoryPostgres;