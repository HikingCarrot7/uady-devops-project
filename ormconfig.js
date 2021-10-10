module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: 'root',
  password: process.env.DB_PASSWORD,
  database: 'devops_vuelos',
  entities: ['dist/entities/**/*.js'],
  synchronize: true,
};
