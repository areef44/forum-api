const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: handler.postCommentHandler,
        options: {
            auth: 'forumapi_auth',
        },
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: handler.deleteCommentHandler,
        options: {
            auth: 'forumapi_auth',
        },
    },
]);

module.exports = routes;
