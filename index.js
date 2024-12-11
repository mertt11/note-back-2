const express = require("express")
const cors = require("cors")
const app = express()
const morgan = require("morgan")
app.use(express.json())
app.use(cors())
app.use(express.static("dist"))

let persons = []

morgan.token("type", (request, response) => {
  return JSON.stringify({
    name: request.body.name,
    number: request.body.number,
  })
})

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
)

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>")
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/info", (request, response) => {
  const getDate = () => {
    const currentDate = new Date()
    return currentDate.toString()
  }
  response.send(
    `Phonebook has info for ${persons.length} people <br/> ${getDate()}`
  )
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const person = persons.find((p) => p.id === id)
  if (person) {
    response.json(person)
  } else {
    return response.status(400).json({
      error: "person is missing",
    })
  }
})

app.post("/api/persons", (request, response) => {
  const person = request.body
  const generateId = () => {
    return Math.floor(Math.random() * 1000)
  }
  const newPerson = {
    name: person.name,
    number: person.number,
    id: String(generateId()),
  }
  if (persons.find((p) => p.name === newPerson.name)) {
    return response.status(400).send({ error: "name must be unique" })
  }
  if (!newPerson.name || !newPerson.number) {
    return response.status(400).send({ error: "name or number is missing" })
  } else {
    persons = persons.concat(newPerson)
    return response.status(201).json(newPerson)
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  persons = persons.filter((p) => p.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
