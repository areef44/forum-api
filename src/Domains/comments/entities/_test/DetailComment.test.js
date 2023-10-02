const DetailComment = require('../DetailComment');

describe('DetailThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {};

        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            comments: {},
        };
        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should mapping comments data correctly', () => {
        const payload = {
            comments: [
                {
                    id: 'comment-_pby2_qwerty123456',
                    username: 'areef44',
                    date: '2023-09-28T08:06:24.591Z',
                    content: 'sebuah comment',
                    is_deleted: 0,
                },
                {
                    id: 'comment-_pby2_qwerty123456',
                    username: 'dicoding',
                    date: '2023-09-28T08:06:24.614Z',
                    content: '**komentar telah dihapus**',
                    is_deleted: 1,
                },
            ],
        };

        const { comments } = new DetailComment(payload);

        const expectedComment = [
            {
                id: 'comment-_pby2_qwerty123456',
                username: 'areef44',
                date: '2023-09-28T08:06:24.591Z',
                content: 'sebuah comment',
            },
            {
                id: 'comment-_pby2_qwerty123456',
                username: 'dicoding',
                date: '2023-09-28T08:06:24.614Z',
                content: '**komentar telah dihapus**',
            },
        ];
        expect(comments).toEqual(expectedComment);
    });
});
