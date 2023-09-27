const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');


describe('/threads/{threadId}/comments endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });
    
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    describe("when POST /threads/{threadId}/comments", () => {
      it('should response 201 and added comment', async () => {
        const payload = {
          content: 'inicontent',
        };
        const thread = {
          id: 'thread-123',
          title: 'Ini Thread',
          body: 'INI ADALAH ISI DARI THREAD',
          owner: 'user-123',
        };
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.createThread(thread);
        const accessToken = await ServerTestHelper.getAccessToken();
        const server = await createServer(container);
  
        const response = await server.inject({
          url: '/threads/thread-123/comments',
          method: 'POST',
          payload: payload,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(201);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data.addedComment).toBeDefined();
        expect(responseJson.data.addedComment.content).toEqual(payload.content);
      });

    });

});

