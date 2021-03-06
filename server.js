const http = require('http');

const express = require('express');
const mongoose = require('mongoose');
const yup = require('yup');

const DB_NAME = process.env.DB_NAME || 'fd_mongoose';
const DB_HOST = 'fd_mongo_db';
const PORT = process.env.PORT || 9999;

mongoose.connect(`mongodb://${DB_HOST}:27017/${DB_NAME}`).catch((err) => {
  console.log(err);
  process.exit(1);
});

const phoneSpecsChema = yup.object().shape({
  cpu: yup.string().required(),
  ram: yup.number().min(1).required(),
  storage: yup.number().min(1).required(),
});


const phoneSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /[A-Za-z ]{1,64}/.test(value),
    },
  },
  model: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  specs: {
    type: Object,
    required: true,
    validate: {
      validator: (value) => phoneSpecsChema.isValid(value),
    },
  },
});

const Phone = mongoose.model('phones', phoneSchema);

const app = express();

app.use(express.json());

app.post('/', async (req, res, next) => {
  try {
    const { body } = req;
    const phone = await Phone.create(body);

    res.status(201).send({ data: phone });
  } catch (error) {
    next(error);
  }
});

app.get('/', async (req, res, next) => {
  try {
    const phones = await Phone.find();

    res.status(200).send({ data: phones });
  } catch (error) {
    next(error);
  }
});

app.patch('/:id', async (req, res, next) => {
  try {
    const {
      body,
      params: { id },
    } = req;

    const updatedPhone = await Phone.findOneAndUpdate({ _id: id }, body, {
      returnDocument: 'after',
    });

    res.send(updatedPhone);
  } catch (error) {
    next(error);
  }
});

app.delete('/:id', async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const deletedPhone = await Phone.findOneAndDelete({_id: id}, {});

    res.send(deletedPhone);
  } catch (error) {
    next(error);
  }
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('server is up');
});
