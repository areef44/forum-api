/* istanbul ignore file */
const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./security/JwtTokenManager');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const UserLoginUseCase = require('../Applications/use_case/UserLoginUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const UserLogoutUseCase = require('../Applications/use_case/UserLogoutUseCase');
const CreateThreadUseCase = require('../Applications/use_case/CreateThreadUseCase');
const CreateCommentUseCase = require('../Applications/use_case/CreateCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase');
const DetailThreadUseCase = require('../Applications/use_case/DetailThreadUseCase');
const CreateReplyUseCase = require('../Applications/use_case/CreateReplyUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/DeleteReplyUseCase');


// Repository
const CommentRepository = require('../Domains/comments/CommentRepository');
const UserRepository = require('../Domains/users/UserRepository');
const ThreadRepository = require('../Domains/threads/ThreadRepository');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const ReplyRepository = require('../Domains/replies/ReplyRepository');

// Repository Postgres
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres');

// helper
const PasswordHash = require('../Applications/security/PasswordHash');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');

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
    {
      key: ThreadRepository.name,
      Class: ThreadRepositoryPostgres,
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
      key: CommentRepository.name,
      Class: CommentRepositoryPostgres,
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
      key: ReplyRepository.name,
      Class: ReplyRepositoryPostgres,
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
    {
      key: CreateThreadUseCase.name,
      Class: CreateThreadUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          {
            name: 'threadRepository',
            internal: ThreadRepository.name,
          },
        ],
      },
    },
    {
      key: CreateCommentUseCase.name,
      Class: CreateCommentUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          {
            name: 'threadRepository',
            internal: ThreadRepository.name,
          },
          {
            name: 'commentRepository',
            internal: CommentRepository.name,
          },
          
        ],
      },
    },
    {
      key: DeleteCommentUseCase.name,
      Class: DeleteCommentUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          {
            name: 'commentRepository',
            internal: CommentRepository.name,
          },
          {
            name: 'threadRepository',
            internal: ThreadRepository.name,
          },
          
        ],
      },
    },
    {
      key: DetailThreadUseCase.name,
      Class: DetailThreadUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          {
            name: 'commentRepository',
            internal: CommentRepository.name,
          },
          {
            name: 'threadRepository',
            internal: ThreadRepository.name,
          },
          {
            name: 'replyRepository',
            internal: ReplyRepository.name,
          },
        ],
      },
    },
    {
      key: CreateReplyUseCase.name,
      Class: CreateReplyUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          {
            name: 'threadRepository',
            internal: ThreadRepository.name,
          },
          {
            name: 'commentRepository',
            internal: CommentRepository.name,
          },
          {
            name: 'replyRepository',
            internal: ReplyRepository.name,
          },
        ],
      },
    },
    {
      key: DeleteReplyUseCase.name,
      Class: DeleteReplyUseCase,
      parameter: {
        injectType: 'destructuring',
        dependencies: [
          {
            name: 'threadRepository',
            internal: ThreadRepository.name,
          },
          {
            name: 'commentRepository',
            internal: CommentRepository.name,
          },
          {
            name: 'replyRepository',
            internal: ReplyRepository.name,
          },
        ],
      },
    },
]);

module.exports = container;