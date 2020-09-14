import express, { Application, Response } from 'express';

const app: Application = express();

app.get('/', (_, res: Response) => {
  res.send('Hello');
});

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
