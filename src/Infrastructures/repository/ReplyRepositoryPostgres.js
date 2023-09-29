const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createReply(newReply) {
    const { content, owner, comment } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
 
    const query = {
      text: `INSERT INTO replies(id, content, owner, comment_id, is_delete, created_at, updated_at) 
             VALUES($1, $2, $3, $4, FALSE, $5, $6) 
            RETURNING id, content, owner`,
      values: [id, content, owner, comment, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    return new CreatedReply({ ...result.rows[0] });
  }
}

module.exports = ReplyRepositoryPostgres;