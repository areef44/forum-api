/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const JwtTokenManager = require('./security/JwtTokenManager');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const UserRepository = require('../Domains/users/UserRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const UserLoginUseCase = require('../Applications/use_case/UserLoginUseCase');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const UserLogoutUseCase = require('../Applications/use_case/UserLogoutUseCase');

// creating container
const container = createContainer();

// registering services and repository
container.register([
    {
        key: UserRepository.name,
        Class: UserRepositoryPostgres,
        parameter: {
                dependencies: [
                {
                    concrete: pool,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
    {
        key: PasswordHash.name,
        Class: BcryptPasswordHash,
        parameter: {
            dependencies: [
                {
                    concrete: bcrypt,
                },
            ],
        },
    },
    {
        key: AuthenticationRepository.name,
        Class: AuthenticationRepositoryPostgres,
        parameter: {
          dependencies: [
            {
              concrete: pool,
            },
          ],
        },
    },
    {
        key: AuthenticationTokenManager.name,
        Class: JwtTokenManager,
        parameter: {
          dependencies: [
            {
              concrete: Jwt.token,
            },
          ],
        },
    },
]);

// registering use cases
container.register([
    {
        key: AddUserUseCase.name,
        Class: AddUserUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'userRepository',
                    internal: UserRepository.name,
                },
                {
                    name: 'passwordHash',
                    internal: PasswordHash.name,
                },
            ],
        },
    },
    {
        key: UserLoginUseCase.name,
        Class: UserLoginUseCase,
        parameter: {
          injectType: 'destructuring',
          dependencies: [
            {
              name: 'userRepository',
              internal: UserRepository.name,
            },
            {
              name: 'authenticationRepository',
              internal: AuthenticationRepository.name,
            },
            {
              name: 'authenticationTokenManager',
              internal: AuthenticationTokenManager.name,
            },
            {
              name: 'passwordHash',
              internal: PasswordHash.name,
            },
          ],
        },
    },
    {
      key: RefreshAuthenticationUseCase.name,
      Class: RefreshAuthenticationUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          {
            name: 'authenticationRepository',
            internal: AuthenticationRepository.name,
          },
          {
            name: 'authenticationTokenManager',
            internal: AuthenticationTokenManager.name,
          },
        ],
      },
    },
    {
      key: UserLogoutUseCase.name,
      Class: UserLogoutUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          {
            name: 'authenticationRepository',
            internal: AuthenticationRepository.name,
          },
        ],
      },
    },
]);

module.exports = container;