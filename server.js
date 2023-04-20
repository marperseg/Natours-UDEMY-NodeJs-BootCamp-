const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION... Shutting down.');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

// Remote DB
mongoose.connect(DB).then(() => {
  // console.log(conn.connections);
  console.log('DB connection successful...');
});
// mongoose.set('strictQuery', true);

// // Local DB
// mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
//   // console.log(conn.connections);
//   console.log('DB connectionc successful...');
// });

// Mongoose @5 options{
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   strictQuery: true,
// }

const PORT = process.env.PORT || 8468;
const server = app.listen(PORT, () => {
  console.log('App running on port ', PORT);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION... Shutting down.');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
