const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();


app.use(express.json())
app.use(express.static('build'))
app.use(cors())
morgan.token('bodyContent', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : " ")
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyContent'))

let persons = [
  { name: "Arto Hellas", number: "040-123456", id: 1 },
  { name: "Ada Lovelace", number: "022-856971", id: 2 },
  { name: "Dan Abramov", number: "12-34-248339", id: 3 },
  { name: "Mary Poppendieck", number: "33-47-627884", id: 4 }
]

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const returnString = `Phonebook has info for ${persons.length} people \n ${new Date()}`;

  res.send(returnString);
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === Number(req.params.id))
  if (person) {
    res.json(person)
  } else {
    res.status(404).json({ error: 'No person found with given id.' })
  }
})

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(p => p.id !== Number(req.params.id))
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {

  const body = req.body

  if (!body.name || !body.number) {
    res.status(400).json({
      error: 'name or number missing'
    })
  } else if (persons.find(p => p.name === body.name)) {
    res.status(400).json({
      error: 'name already exists'
    })
  } else {
    const newPerson = {
      name: req.body.name,
      number: req.body.number,
      id: Math.floor((Math.random() * 100)) + 1
    }

    persons = persons.concat(newPerson)

    res.json(newPerson)
  }


})

const PORT = process.env.PORT || 3001;
app.listen(PORT, console.log(`Server running on port ${PORT}`))