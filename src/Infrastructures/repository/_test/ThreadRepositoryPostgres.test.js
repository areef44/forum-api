const ThreadTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');


describe ('thread Repository Postgres', () => {
    it('should be instance of thread repository domain', () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres({},{}); // Dummy

        expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
    });

    describe('behavior test', () => {
        afterEach(async () => {
            await ThreadTableTestHelper.cleanTable();
        });

        afterAll(async () => {
            await pool.end();
        });

        describe('verifyAvailableThread function', () => {
            it('should throw InvariantError when thread not available', async () => {
                await UsersTableTestHelper.addUser({id: 'user-12345678', username: 'arif'});
                await ThreadTableTestHelper.createThread({ title: 'sebuah thread', owner: 'user-12345678' });
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

                await expect(threadRepositoryPostgres.verifyAvailableThread('sebuah thread')).rejects.toThrowError(InvariantError);
            });

            it('should not throw InvariantError when thread available', async () => {
                // Arrange
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

                // Action & Assert
                await expect(threadRepositoryPostgres.verifyAvailableThread('sebuah thread')).resolves.not.toThrowError(InvariantError);
            });
        });

        describe('createThread function', () => {
            it('should persist new thread and return created thread correctly', async () => {
                await UsersTableTestHelper.addUser({ id: 'user-123456', username: 'areef44' });

                const newThread = new CreateThread({
                    title: 'sebuah thread',
                    body: 'sebuah body thread',
                    owner: 'user-123456',
                });

                const fakeIdGenerator = () => 'sdadasd21321334';
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

                const createdThread = await threadRepositoryPostgres.createThread(newThread);

                const thread = await ThreadTableTestHelper.findThreadsById('thread-h_sdadasd21321334');
                expect(createdThread).toStrictEqual(new CreatedThread({
                    id: 'thread-h_sdadasd21321334',
                    title: 'sebuah thread',
                    owner: 'user-123456',
                }));
                expect(thread).toHaveLength(1);
            });
        });
    });
});