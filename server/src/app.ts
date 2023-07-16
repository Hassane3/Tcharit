import express from 'express';
import cors from "cors";


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get('/message', (req, res) => {
  res.json({message :  'Hello World!'});
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});