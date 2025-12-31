import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mimir Control API',
      version: '1.0.0',
      description:
        'The fountain of wisdom for your home: Controlling smart TVs (Sony, Samsung, LG)',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/app.ts'], // Scanning the routes folder
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
