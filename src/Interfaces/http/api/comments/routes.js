const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: handler.postCommentHandler,
        options: {
            auth: 'forumapi_auth',
        },
    },
]);

module.exports = routes;