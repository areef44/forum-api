/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('replies',{
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        thread: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        is_delete: {
            type: 'BOOLEAN',
            notNull: true,
            defaultValue: false,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        }
    });

    pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

    pgm.addConstraint('comments', 'fk_comments.thread_id_threads.id', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE');

};

exports.down = (pgm) => {
    pgm.dropConstraint('replies', 'fk_replies.owner_users.id');
    pgm.dropConstraint('replies', 'fk_replies.comment_id_comments.id');

    pgm.dropTable('replies');
};
