const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createReply function', () => {
    it('should persist create reply and return created reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // add user with id user-123
      await ThreadsTableTestHelper.createThread({ id: 'thread-123' }); // add thread with id thread-123
      await CommentsTableTestHelper.createComment({ id: 'comment-123' }); // add comment with id comment-123
      const createReply = new CreateReply({
        content: 'reply content',
        owner: 'user-123',
        comment: 'comment-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdReply = await replyRepositoryPostgres.createReply(createReply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById(createdReply.id);
      expect(replies).toHaveLength(1);
    });
  });
});