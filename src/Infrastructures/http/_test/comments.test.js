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
          content: 'sebuah comment',
        };
        const thread = {
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'sebuah body thread',
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

      it('should response 401 if payload not access token', async () => {
        // Arrange
        const server = await createServer(container);
        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads/xxx/comments',
          payload: {},
        });
  
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(401);
        expect(responseJson.error).toEqual('Unauthorized');
        expect(responseJson.message).toEqual('Missing authentication');
      });

      it('should response 400 if payload not contain needed property', async () => {
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
        
        
        const responseAuth = JSON.parse(authentication.payload);
        
        const thread = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: {
            title: 'sebuah thread',
            body: 'sebuah body thread',
          },
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
        
        
        const threadResponse = JSON.parse(thread.payload);

        const threadId = threadResponse.data.addedThread.id;
        const url = `/threads/${threadId}/comments`;
        
        // Action
        const response = await server.inject({
          method: 'POST',
          url: url,
          payload: {},
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
        
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(400);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
      });

      it('should response 400 if payload not meet data type specification', async () => {
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
  
        const responseAuth = JSON.parse(authentication.payload);
  
        const thread = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: {
            title: 'sebuah thread',
            body: 'sebuah body thread',
          },
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
  
        const threadResponse = JSON.parse(thread.payload);
        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadResponse.data.addedThread.id}/comments`,
          payload: {
            content: 12334344545,
          },
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
  
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(400);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
      });

      it('should response 404 if thread id not valid', async () => {
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
          url: '/threads/qwerty/comments',
          payload: {
            content: 'sebuah comment',
          },
          headers: { Authorization: `Bearer ${authResponse.data.accessToken}` },
        });
  
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('thread tidak ditemukan');
      });

    });

    describe('when DELETE /threads/{threadId}/comments', () => {
      it('should response 403 when other user try to delete the comment', async () => {
        const payloadLogin = {
          username: 'areef44',
          password: 'secret',
        };
  
        const payloadLoginOtherUser = {
          username: 'otheruser',
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
  
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'otheruser',
            password: 'secret',
            fullname: 'other user fullname',
          },
        });
  
        const authentication = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: payloadLogin,
        });
  
        const responseAuth = JSON.parse(authentication.payload);
  
        const thread = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: {
            title: 'sebuah thread',
            body: 'sebuah body thread',
          },
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
  
        const threadResponse = JSON.parse(thread.payload);

        const url = `/threads/${threadResponse.data.addedThread.id}/comments`
  
        const comment = await server.inject({
          method: 'POST',
          url: url ,
          payload: {
            content: 'sebuah comment',
          },
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
  
        const commentResponse = JSON.parse(comment.payload);
  
        const authenticationOtherUser = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: payloadLoginOtherUser,
        });
  
        const responseAuthOtherUser = JSON.parse(authenticationOtherUser.payload);

        const url2 = `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}`;
  
        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: url2,
          headers: { Authorization: `Bearer ${responseAuthOtherUser.data.accessToken}` },
        });
  
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(403);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('kamu tidak bisa menghapus komentar punya orang lain.');
      });

      it('should response 404 when thread not found', async () => {
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
  
        const responseAuth = JSON.parse(authentication.payload);

        const url = '/threads/qwerty/comments/qwerty'
  
        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: url,
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
  
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('thread tidak ditemukan');
      });

      it('should response 404 when comment not found', async () => {
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
  
        const responseAuth = JSON.parse(authentication.payload);
  
        const thread = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: {
            title: 'sebuah thread',
            body: 'sebuah body thread',
          },
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
  
        const threadResponse = JSON.parse(thread.payload);
        
        const url = `/threads/${threadResponse.data.addedThread.id}/comments/qwerty`;
        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: url,
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
  
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('komentar tidak ditemukan');
      });
      
      it('should response 200 and return success message', async () => {
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
  
        const responseAuth = JSON.parse(authentication.payload);
  
        const thread = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: {
            title: 'sebuah thread',
            body: 'sebuah body thread',
          },
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
  
        const threadResponse = JSON.parse(thread.payload);

        const url = `/threads/${threadResponse.data.addedThread.id}/comments`;
  
        const comment = await server.inject({
          method: 'POST',
          url: url,
          payload: {
            content: 'sebuah comment',
          },
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
  
        const commentResponse = JSON.parse(comment.payload);
  
        const url2 = `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}`;
        
        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: url2,
          headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
        });
  
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual('success');
      });
    });
});

