const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Person = require('./models/Person');

// express app
const app = express();

// loading env variables
dotenv.config({ path: './config/config.env' });

// connecting DB
connectDB()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('bodyContent', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : " ")
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyContent'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then(result => {
    const returnString = `Phonebook has info for ${result.length} people \n ${new Date()}`;
    res.send(returnString);

  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person.toJSON())
    } else {
      res.status(404).end()
    }
  }).catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    }).catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {

  const body = req.body

  if (!body.name || !body.number) {
    res.status(400).json({
      error: 'name or number missing'
    })
  } else {
    const newPerson = new Person({
      name: req.body.name,
      number: req.body.number,
    })

    newPerson
      .save()
      .then(savedPerson => {
        console.log(savedPerson.toJSON())
        res.json(savedPerson.toJSON())
      })
      .catch(err => next(err))
  }


})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => res.json(updatedPerson.toJSON()))
    .catch(err => next(err))
})

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, console.log(`Server running on port ${PORT}`))