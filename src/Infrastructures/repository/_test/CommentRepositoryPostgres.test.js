const pool  = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CreateComment = require("../../../Domains/comments/entities/CreateComment");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreatedComment = require("../../../Domains/comments/entities/CreatedComment");

describe('CommentRepositoryPostgres', () => {
    it('should be instance of ThreadRepository domain', () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {}); // Dummy dependency
    
        expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepositoryPostgres);
    });

    describe('behavior test', () => {
        afterEach(async () => {
            await CommentsTableTestHelper.cleanTable();
        });

        afterAll(async () => {
            await pool.end();
        });

        describe('createComment function', () => {
                it('should persist new comment and return create comment correctly', async () => {
                    await UsersTableTestHelper.addUser({ id: 'user-9876543210', username: 'userforum-123' });
                    await ThreadsTableTestHelper.createThread({ id: 'thread-h_9876543210', body: 'sebuah thread', owner: 'user-9876543210'
                });

                const newComment = new CreateComment({
                    content: 'sebuah comment',
                    thread: 'thread-h_9876543210',
                    owner: 'user-9876543210',
                });

                const fakeIdGenerator = () => '9876543210qwerty';
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

                const createComment = await commentRepositoryPostgres.createComment(newComment);

                const comment = await CommentsTableTestHelper.findCommentsById('comment-_pby2_9876543210qwerty');
                expect(createComment).toStrictEqual(new CreatedComment({
                    id: 'comment-_pby2_9876543210qwerty',
                    content: 'sebuah comment',
                    owner: 'user-9876543210',
                }));
                expect(comment).toHaveLength(1);
            });
        });
    });
});