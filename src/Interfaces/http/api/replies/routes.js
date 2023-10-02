const routes = (handler) => ([
    {
      method: 'POST',
      path: '/threads/{threadId}/comments/{commentId}/replies',
      handler: handler.postReplyHandler,
      options: {
        auth: 'forumapi_auth',
    },
    },
    {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
      handler: handler.deleteReplyByIdHandler,
      options: {
        auth: 'forumapi_auth',
      },
    },
  ]);

module.exports = routes;
