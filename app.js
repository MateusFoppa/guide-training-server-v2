require('dotenv').config();
require('express-async-errors');

// extra security packages
const cookieParser = require('cookie-parser');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Swagger
// const swaggerUI = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const { authenticateUser } = require('./middleware/authentication');

// routers
const authRouter = require('./routes/auth');
const trainingRouter = require('./routes/training');
const exerciseRouter = require('./routes/exercise');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// db mysql
const db = require("./db/db");


app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
  console.log(req.signedCookies.token);
  res.send('<h1>GuideTraining API</h1>');
});
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/auth', authRouter);
app.use('/training', authenticateUser, trainingRouter);

app.use('/exercise', authenticateUser, exerciseRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    db.sync().then(() => {
      console.log(`Banco de dados conectado: ${process.env.DB_NAME}`);
    });
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
