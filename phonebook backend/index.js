require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/persons')




const app = express();
app.use(express.json());
app.use(cors());

//create custom morgan format
morgan.format('custom-json', (tokens, req, res) => {
    return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        responseTime: tokens['response-time'](req, res) + ' ms',
        requestBody: req.body,
        timestamp: new Date().toISOString()
    });
});

app.use(morgan('custom-json'));

//serve frontend build
app.use(express.static('dist'));


const generateId = () => {
    let newId;
    let isDuplicate = true;
    while (isDuplicate) {
        newId = Math.floor(Math.random() * 1000000).toString();
        isDuplicate = persons.some(person => person.id === newId);
    }
    return newId;
}


//get all persons
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
         res.json(persons);
    })
})

//info route
app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        `);
    
});

//adding a new person
app.post('/api/persons', (req, res) => {
    const newPerson = req.body;
    const existingPerson = persons.find(person => person.name === newPerson.name);

    if (!newPerson.name || !newPerson.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        })
    }
    
    if (existingPerson) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: newPerson.name,
        number: newPerson.number
    }

    persons.push(person);
    console.log(person);
    res.json(person);
})

//update a person number
app.put('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const newNumber = req.body.number;
    const person = persons.find(person => person.id === id);
    if (person) {
        person.number = newNumber;
        res.json(person);
    } else {
        res.status(404).end();
    }
})

//getting a single person
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})


//deleting a person
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        persons.splice(persons.indexOf(person), 1);
        res.status(204).end();
    } else {
        res.status(404).end();
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})