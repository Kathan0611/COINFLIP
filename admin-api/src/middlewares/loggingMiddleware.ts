//src/middlewares/loggingMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger'; // Adjust the import path according to your project structure

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  req.headers['x-request-id'] = requestId; // Optionally, attach the ID to the request headers

  // Log the request with the request ID
  logger.info(
    `Request ID: ${requestId} - ${req.method} ${req.url} - ${JSON.stringify(req.body)} - ${JSON.stringify(req.query)}`,
  );

  // Track the start time of the request
  req.startTime = Date.now();

  // Attach an event listener for when the response is finished
  res.on('finish', () => {
    const duration = Date.now() - (req.startTime || 0);
    logger.info(`Request ID: ${requestId} - Response Status: ${res.statusCode} - Duration: ${duration}ms`);
  });

  // Attach an event listener for when an error occurs
  res.on('error', (err: Error) => {
    logger.error(
      `Request ID: ${requestId} - Error: ${err.message} - ${JSON.stringify(req.body)} - ${JSON.stringify(req.query)}`,
    );
  });

  // Pass the request ID along to the next middleware or route handler
  next();
};

export default loggingMiddleware;
