const express = require('express')
const app = express()
require('dotenv').config()

const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  next(error)
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', function (req,) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => {
    next(error)
  })
})

app.get('/info', (_request, response, next) => {
  Person.countDocuments({})
    .then(length => {
      response.send(`<p>Phonebook has info for ${length} people</p><p>${new Date().toString()}</p>`)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  const newPerson = {
    name: String(name),
    number: String(number),
  }

  Person.findByIdAndUpdate(
    id,
    newPerson,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person({
    name: String(name),
    number: String(number),
  })

  person.save({ runValidators: true })
    .then(() => {
      console.log(`add person ${person}`)
      response.json(person)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.POST || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
