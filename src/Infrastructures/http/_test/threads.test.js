const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

// Unit test for threads endpoint
describe('POST /threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 400 when payload dont have access token', async () => {
            // Arrange
            const server = await createServer(container);
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {},
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 400 when payload not contain needed property', async () => {
            // Arrange
            const payloadLogin = {
                username: 'areef44',
                password: 'secret',
            };
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'areef44',
                    password: 'secret',
                    fullname: 'Muhammad Arif',
                },
            });

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: payloadLogin,
            });

            const authResponse = JSON.parse(authentication.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {},
                headers: { Authorization: `Bearer ${authResponse.data.accessToken}`},
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when payload not meet data type specification', async() => {
            // Arrange
            const payloadLogin = {
                username: 'areef44',
                password: 'secret',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'areef44',
                    password: 'secret',
                    fullname: 'Muhammad Arif',
                },
            });

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: payloadLogin,
            });

            const authResponse = JSON.parse(authentication.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 987,
                    body: ['sebuah body thread'],
                },
                headers: { Authorization: `Bearer ${authResponse.data.accessToken}`},
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
        });

        it('should response 201 when create new thread', async () => {
            // Arrange
            const payloadLogin = {
                username: 'areef44',
                password: 'secret',
            };

            
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'areef44',
                    password: 'secret',
                    fullname: 'Muhammad Arif',
                },
            });

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: payloadLogin,
            });

            const authResponse = JSON.parse(authentication.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'sebuah thread',
                    body: 'sebuah body thread',
                },
                headers: { Authorization: `Bearer ${authResponse.data.accessToken}`},
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });
    });
    
    describe('GET /threads/{threadId} endpoint', () => {
        it('should response 200 and show thread by id', async () => {
            // Arrange
            const threadId = 'thread-123';
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.createThread({ id: threadId, owner: 'user-123' });
            const server = await createServer(container);
      
            // Action
            const response = await server.inject({
              method: 'GET',
              url: `/threads/${threadId}`,
            });
      
            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
          });
    });
});