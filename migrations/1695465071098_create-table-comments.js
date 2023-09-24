/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('comments',{
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        thread: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"threads"',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        is_deleted: {
            type: 'INTEGER',
            notNull: true,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        }
    })
};

exports.down = (pgm) => {
    pgm.dropTable('comments');
};

