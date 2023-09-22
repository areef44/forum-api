const ThreadTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');


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
                    body: 'sebuah body thread',
                    owner: 'user-123456',
                }));
                expect(thread).toHaveLength(1);
            });
        });
    });
});