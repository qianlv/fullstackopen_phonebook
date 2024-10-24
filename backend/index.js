const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let phonebooks = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get("/api/persons", (request, response) => {
  response.json(phonebooks)
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const person = phonebooks.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${phonebooks.length} people</p><p>${new Date().toString()}</p>`)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  phonebooks = phonebooks.filter(person => person.id !== id)
  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (phonebooks.find(person => person.name === String(body.name))) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    id: String(Math.floor(Math.random() * 10000000)),
    name: String(body.name),
    number: String(body.number),
  }

  phonebooks = phonebooks.concat(person)

  response.json(person)
})

const PORT = process.env.POST || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
