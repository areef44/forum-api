const ThreadTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');


describe ('thread Repository Postgres', () => {
    it('should be instance of thread repository domain', () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres({},{}); // Dummy

        expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
    });

    describe('behavior test', () => {
        afterEach(async () => {
            await ThreadTableTestHelper.cleanTable();
            await UsersTableTestHelper.cleanTable();
        });

        afterAll(async () => {
            await pool.end();
        });


        describe('createThread function', () => {
            it('should persist new thread and return created thread correctly', async () => {
                await UsersTableTestHelper.addUser({ id: 'user-123456', username: 'areef' });

                const newThread = new CreateThread({
                    title: 'sebuah thread',
                    body: 'sebuah body thread',
                    owner: 'user-123456',
                });

                const fakeIdGenerator = () => 'abcdef123456';
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

                const createdThread = await threadRepositoryPostgres.createThread(newThread);

                const thread = await ThreadTableTestHelper.findThreadsById('thread-h_abcdef123456');
                expect(createdThread).toStrictEqual(new CreatedThread({
                    id: 'thread-h_abcdef123456',
                    title: 'sebuah thread',
                    owner: 'user-123456',
                }));
                expect(thread).toHaveLength(1);
            });
        });

        describe('checkAvailabilityThread function', () => {
            it('should throw NotFoundError when thread not available', async () => {
                // Arrange
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
                const threadId = 'xxx';

                // Action & Assert
                await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId)).rejects.toThrowError(NotFoundError);
            });

            it('should not throw NotFoundError when thread available', async () => {
                // Arrange
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({id: 'user-123456789', username: 'areef44'});
                await ThreadTableTestHelper.createThread({ id: 'thread-h_123', body: 'sebuah thread', owner: 'user-123456789' });

                // Action & Assert
                await expect(threadRepositoryPostgres.checkAvailabilityThread('thread-h_123')).resolves.not.toThrowError(NotFoundError);
            });
        });

        describe('getDetailThread function', () => {
            it('should get detail thread', async () => {
              const threadRepository = new ThreadRepositoryPostgres(pool, {});
              const userPayload = { id: 'user-123456', username: 'areef44' };
              const threadPayload = {
                id: 'thread-h_123456',
                title: 'sebuah thread',
                body: 'sebuah body thread',
                owner: 'user-123456',
              };
              await UsersTableTestHelper.addUser(userPayload);
              await ThreadTableTestHelper.createThread(threadPayload);
      
              const detailThread = await threadRepository.getDetailThread(threadPayload.id);
      
              expect(detailThread.id).toEqual(threadPayload.id);
              expect(detailThread.title).toEqual(threadPayload.title);
              expect(detailThread.body).toEqual(threadPayload.body);
              expect(detailThread.username).toEqual(userPayload.username);
            });
        });
    });
});