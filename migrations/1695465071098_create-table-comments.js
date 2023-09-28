/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        thread: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        is_deleted: {
            type: 'BOOLEAN',
            notNull: true,
            default: false, // Mengganti 'defaultValue' menjadi 'default'
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

    // Mengganti nama constraint yang salah
    pgm.addConstraint('comments', 'fk_comments_thread', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE');
    pgm.addConstraint('comments', 'fk_comments_owner', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    // Mengganti nama constraint yang salah
    pgm.dropConstraint('comments', 'fk_comments_owner');
    pgm.dropConstraint('comments', 'fk_comments_thread');
    pgm.dropTable('comments');
};