const routes = (handler) => ([
    {
      method: 'POST',
      path: '/threads/{threadId}/comments/{commentId}/replies',
      handler: handler.postReplyHandler,
      options: { 
        auth: 'forumapi_auth' 
    },
    },
  ]);
  
  module.exports = routes;
