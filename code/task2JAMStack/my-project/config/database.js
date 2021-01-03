// sqlite数据库
module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      // 默认是通过sqlite本地文件的形式存储数据库
      // 线上推荐使用mysql,mongode,...
      // https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#database
      settings: {
        client: 'sqlite',
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});

// mysql数据库
// module.exports = ({ env }) => ({
//   defaultConnection: 'default',
//   connections: {
//     default: {
//       connector: 'bookshelf',
//       settings: {
//         client: 'mysql',
//         // 后端和数据库是同一个服务器就不想要改host了
//         host: env('DATABASE_HOST', 'localhost'),
//         port: env.int('DATABASE_PORT', 3306),
//         // 数据库名称
//         database: env('DATABASE_NAME', 'blog'),
//         // 数据库账号
//         username: env('DATABASE_USERNAME', 'blog'),
//         // 数据库密码
//         password: env('DATABASE_PASSWORD', '513543545454'),
//       },
//       options: {},
//     },
//   },
// });
