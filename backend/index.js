const express = require("express")
const app = express()
require("dotenv").config()

const morgan = require("morgan")
const cors = require("cors")

const Person = require("./models/person")

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'NameMissing') {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (error.name === 'NumberMissing') {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  next(error)
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
})

app.get("/api/persons/:id", (request, response, next) => {
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

app.get("/info", (_request, response, next) => {
  Person.countDocuments({})
    .then(length => {
      response.send(`<p>Phonebook has info for ${length} people</p><p>${new Date().toString()}</p>`)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(_result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  const body = request.body

  if (!body.name) {
    return next({ name: "NameMissing" })
  }
  if (!body.number) {
    return next({ name: "NumberMissing" })
  }

  const newPerson = {
    name: String(body.name),
    number: String(body.number),
  }

  Person.findByIdAndUpdate(id, newPerson, { new: true })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body
  if (!body.name) {
    return next({ name: "NameMissing" })
  }
  if (!body.number) {
    return next({ name: "NumberMissing" })
  }

  // if (phonebooks.find(person => person.name === String(body.name))) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }
  const person = new Person({
    name: String(body.name),
    number: String(body.number),
  })

  person.save()
    .then(result => {
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
