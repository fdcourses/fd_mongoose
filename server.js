const http = require('http');

const express = require('express');
const mongoose = require('mongoose');
const yup = require('yup');

const DB_NAME = process.env.DB_NAME || 'fd_mongoose';

mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`)
.catch((err) => {
  console.log(err);
  process.exit(1);
})

const phoneSpecsChema = yup.object().shape({
  cpu: yup.string().required(),
  ram: yup.number().min(1).required(),
  storage: yup.number().min(1).required()
})

const PORT = process.env.PORT || 3000;

const phoneSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /[A-Za-z ]{1,64}/.test(value)
    }
  },
  model: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  specs: {
    type: Object,
    required: true,
    validate: {
      validator: (value) => phoneSpecsChema.isValid(value)
    }
  },
})

const Phone = mongoose.model('phones', phoneSchema);


const app = express();

app.use(express.json());

app.post('/', async(req, res,next) => {
  try {
    const {body} = req;
    const phone = await Phone.create(body);

    res.status(201).send({data: phone});
  } catch (error) {
    next(error)
  }
})

app.get('/', async(req, res, next) => {
  try {
    const phones = await Phone.find();

    res.status(200).send({data: phones});
  } catch (error) {
    next(error)
  }
})




const server = http.createServer(app);

server.listen(PORT, ()=> {
  console.log('server is up')
})