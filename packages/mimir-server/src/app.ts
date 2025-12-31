import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import tvRoutes from './routes/tv.routes.js';
import logger from './utils/logger.js';

const app: express.Application = express();

app.use(cors());
app.use(express.json());

// --- LOGGING ---
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// --- SWAGGER UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (_req, res) => res.redirect('/api-docs'));

// --- ROUTES ---
app.use('/api', tvRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled Exception', { error: err });
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
