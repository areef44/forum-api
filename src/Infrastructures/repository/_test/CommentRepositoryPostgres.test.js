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

    describe('behavior test', () => {
        afterEach(async () => {
            await CommentsTableTestHelper.cleanTable();
            await ThreadsTableTestHelper.cleanTable();
            await UsersTableTestHelper.cleanTable();
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

            it('should not throw NotFoundError when comment available', async () => {
                // Arrange
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({
                    id: 'user-987654321', 
                    username: 'areef44',
                });
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
                const comment = 'comment-123';
                const owner = 'user-123';
                const wrongUser= 'user-456';
                await UsersTableTestHelper.addUser({ id: owner }); // add user with id user-123
                await ThreadsTableTestHelper.createThread({ id: 'thread-123' }); // add thread with id thread-123
                await CommentsTableTestHelper.createComment({ id: comment });
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

                // Action & Assert
                expect(commentRepositoryPostgres.verifyCommentOwner(comment, wrongUser)).rejects.toThrowError(AuthorizationError);
            });

            it('should not throw AuthorizationError if comment is belongs to owner', async () => {
                // Arrange
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
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

        describe('deleteComment', () => {
            it('should delete comment from database', async () => {
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
                const comment = await CommentsTableTestHelper.checkIsDeletedCommentsById('comment-_pby2-654321');
                expect(comment).toEqual(true);
            });
        });

        describe('get comment threads function', () => {
            it('should get comments by thread ID correctly', async () => {
                // Arrange
                const threadId = 'thread-123';
                await UsersTableTestHelper.addUser({ id: 'user-123' }); // add user with id user-123
                await ThreadsTableTestHelper.createThread({ id: threadId }); // add thread with id thread-123
                await CommentsTableTestHelper.createComment({
                  id: 'comment-123', // add comment with id comment-123
                  threadId,
                  date: '2023-10-01T09:37:42.244Z' // should be the second comment
                });
                await CommentsTableTestHelper.createComment({
                  id: 'comment-456', // add comment with id comment-456
                  threadId,
                  date: '2023-10-01T09:37:43.326Z' // should be the first comment
                });
                const fakeIdGenerator = () => '123'; // stub!
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
          
                // Action
                const comments = await commentRepositoryPostgres.getCommentsThread(threadId);
          
                // Assert
                expect(comments).toBeDefined();
                expect(comments).toHaveLength(2);
                expect(comments[0].id).toEqual('comment-123');
                expect(comments[1].id).toEqual('comment-456');
              });

              it('should show empty array if no comment found by thread ID', async () => {
                // Arrange
                const threadId = 'thread-123';
                await UsersTableTestHelper.addUser({ id: 'user-123' }); // add user with id user-123
                await ThreadsTableTestHelper.createThread({ id: threadId }); // add thread with id thread-123
                const fakeIdGenerator = () => '123'; // stub!
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
          
                // Action
                const comments = await commentRepositoryPostgres.getCommentsThread(threadId);
          
                // Assert
                expect(comments).toBeDefined();
                expect(comments).toHaveLength(0);
              });
            
        });
    });
});