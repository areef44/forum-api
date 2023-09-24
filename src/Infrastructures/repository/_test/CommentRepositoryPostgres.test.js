const pool  = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CreateComment = require("../../../Domains/comments/entities/CreateComment");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreatedComment = require("../../../Domains/comments/entities/CreatedComment");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

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

        describe('checkAvailabilityComment function', () => {
            it('should throw NotFoundError when comment not available', async () => {
                // Arrange
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                const comment = 'xxx';

                // Action & Assert
                await expect(commentRepositoryPostgres.checkAvailabilityComment(comment)).rejects.toThrow(NotFoundError);
            });

            it('should not throw NotFoundError if comment available', async () => {
                // Arrange
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({id: 'user-987654321', username: 'areef44'});
                await ThreadsTableTestHelper.createThread({ id: 'thread-h_654321', body: 'sebuah thread', owner: 'user-987654321'});

                await CommentsTableTestHelper.createComment({
                    id: 'comment-_pby2-654321', content: 'sebuah comment', thread: 'thread-h_654321', owner: 'user-987654321',
                });

                // Action & Assert
                await expect(commentRepositoryPostgres.checkAvailabilityComment('comment-_pby2-654321')).resolves.not.toThrow(NotFoundError);
            });
        });

        describe('verifyCommentOwner function', () => {
            it('should throw AuthorizationError when comment not belong to owner', async () => {
                // Arrange
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool,{});
                await UsersTableTestHelper.addUser({ id: 'user-999999999', username: 'areef43' });
                await UsersTableTestHelper.addUser({ id: 'user-999999999', username: 'areef42' });
                await ThreadsTableTestHelper.createThread({ 
                    id: 'thread-h_654321', 
                    body: 'sebuah thread', 
                    owner: 'user-999999999' });
                await CommentsTableTestHelper.createComment({
                    id: 'comment-_pby2-654321',
                    content: 'sebuah comment',
                    thread: 'thread-h_654321',
                    owner: 'user-999999999',
                });
                const comment = 'comment-_pby2-654321';
                const owner = 'user-999999999';

                // Action & Assert
                await expect(commentRepositoryPostgres.verifyCommentOwner(comment, owner)).rejects.toThrow(AuthorizationError);
            });

            it('should not throw AuthorizationError if comment is belongs to owner', async () => {
                // Arrange
                const CommentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({ 
                    id: 'user-99999999', 
                    username: 'areef45' 
                });
                await ThreadsTableTestHelper.createThread({ 
                    id: 'thread-h_654321', 
                    body: 'sebuah thread', 
                    owner: 'user-99999999' 
                });
                await CommentsTableTestHelper.createComment({
                    id: 'comment-_pby2-654321', 
                    content: 'sebuah comment', 
                    thread: 'thread-h_654321', 
                    owner: 'user-99999999',
                });

                // Action & Assert
                await expect(commentRepositoryPostgres.verifyCommentOwner('comment-_pby2-654321', 'user-99999999')).resolves.not.toThrow(AuthorizationError);
            });
        });

        describe('deleteToken', () => {
            it('should delete token from database', async () => {
                // Arrange
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({ 
                    id: 'user-88888888', 
                    username: 'areef46' 
                });
                await ThreadsTableTestHelper.createThread({ 
                    id: 'thread-h_654321', 
                    body: 'sebuah thread', 
                    owner: 'user-88888888' });
                await CommentsTableTestHelper.createComment({
                    id: 'comment-_pby2-654321', 
                    content: 'sebuah comment', 
                    thread: 'thread-h_654321', 
                    owner: 'user-88888888',
                });

                // Action
                await commentRepositoryPostgres.deleteComment('comment-_pby2-654321');

                // Assert
                const comment = await CommentsTableTestHelper.findCommentsById('comment-_pby2-654321');
                expect(comment).toHaveLength(0);
            });
        });
    });
});