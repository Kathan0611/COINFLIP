import express from 'express';
import bodyParser from 'body-parser';
import adminRoutes from './routes/admin';
import apiRoutes from './routes/api';
import { sequelize } from './config/database';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import loggingMiddleware from './middlewares/loggingMiddleware';
import cors from 'cors';
import fs from 'fs';
import * as gameRoutes from './routes/games';
dotenv.config();

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 3001;

// Determine __dirname
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loggingMiddleware);
app.use(express.static(join(__dirname, 'dist')));

// Set mediaDir to be inside src/assets/uploads/media
const mediaDir = path.resolve(process.cwd(), 'src/assets/uploads/media');
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
  console.log('Created media folder at:', mediaDir);
} else {
  console.log('Media folder already exists at:', mediaDir);
}
app.use('/media', express.static(mediaDir));
app.use('/static', express.static(path.join(__dirname, '../src/assets/uploads/static')));
app.use('/exports', express.static(path.join(__dirname, '../src/assets/uploads/exports')));
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

app.use('/admin/games', gameRoutes.adminRouter);
app.use('/api/games', gameRoutes.apiRouter);

sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
