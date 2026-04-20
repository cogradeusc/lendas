import express from 'express';
import apiRoutes from './routes/apiRoutes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectLivereload from 'connect-livereload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envExamplePath = path.join(__dirname, '.env');
dotenv.config({ path: envExamplePath });

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(connectLivereload());
}

app.use(express.json());
app.use('/api', apiRoutes);

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
