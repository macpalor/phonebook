const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())

morgan.token('body', request => {
    return request.method === 'POST' ? JSON.stringify(request.body) : ' '
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]  

app.get('/info', (request, response) => {
    message = ` 
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${Date().toString()}</p>`
    
    response.send(message)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const deleted = persons.find(item => item.id === id)
    persons = persons.filter(person => person.id !== id)

    response.json(deleted)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({error: 'name missing'})
    }

    if (!body.number) {
        return response.status(400).json({error: 'number missing'})
    }

    if (persons.some(person => JSON.stringify(person.name) === JSON.stringify(body.name))) {
        return response.status(400).json({error: 'name must be unique'})
    }

    const person = {
        id: Math.round(Math.random()*10000000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    console.log('person is', person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})