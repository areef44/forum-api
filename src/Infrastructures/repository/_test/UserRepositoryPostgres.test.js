const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const UserRepository = require('../UserRepositoryPostgres');


describe('UserRepositoryPostgres', () => {
    it('should be instance of UserRepository domain', () => {
        const userRepositoryPostgres = new UserRepositoryPostgres({}, {}); // Dummy dependency
    
        expect(userRepositoryPostgres).toBeInstanceOf(UserRepository);
    });
    /**
     * Fungsi afterEach dan afterAll merupakan fungsi yang digunakan untuk menampung sekumpulan kode yang dijalankan setelah melakukan pengujian. Bedanya fungsi afterEach dieksekusi setiap kali fungsi it selesai dijalankan, sedangkan afterAll dieksekusi setelah seluruh fungsi it selesai dijalankan.
     */
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('verifyAvailableUsername function', () => {
        it('should throw InvariantError when username not available', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ username: 'dicoding' }); // memasukan user baru dengan username dicoding
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
    
            // Action & Assert
            await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrowError(InvariantError);
        });

        it('should not throw InvariantError when username available', async () => {
            // Arrange
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(InvariantError);
        });
    });

    describe('addUser function', () => {
        it('should persist register user', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'secret_password',
                fullname: 'Dicoding Indonesia',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await userRepositoryPostgres.addUser(registerUser);

            // Assert
            const users = await UsersTableTestHelper.findUsersById('user-123');
            expect(users).toHaveLength(1);
        });
    
        it('should return registered user correctly', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'secret_password',
                fullname: 'Dicoding Indonesia',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const registeredUser = await userRepositoryPostgres.addUser(registerUser);

            // Assert
            expect(registeredUser).toStrictEqual(new RegisteredUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
            }));
        });

        describe('getIdByUsername', () => {
            it('should throw InvariantError when user not found', async () => {
                // Arrange
                const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
    
                // Action & Assert
                await expect(userRepositoryPostgres.getIdByUsername('dicoding')).rejects.toThrowError(InvariantError);
            });
    
            it('should return user id correctly', async () => {
                // Arrange
                await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dicoding'});
                const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
    
                // Action
                const userId = await userRepositoryPostgres.getIdByUsername('dicoding');
    
                // Assert
                expect(userId).toEqual('user-321');
            });
        });
    });
});
