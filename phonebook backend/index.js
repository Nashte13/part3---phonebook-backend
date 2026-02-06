require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/persons");

const app = express();
app.use(express.json());
app.use(cors());

//create custom morgan format
morgan.format("custom-json", (tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    responseTime: tokens["response-time"](req, res) + " ms",
    requestBody: req.body,
    timestamp: new Date().toISOString(),
  });
});

app.use(morgan("custom-json"));

//serve frontend build
app.use(express.static("dist"));

const generateId = () => {
  let newId;
  let isDuplicate = true;
  while (isDuplicate) {
    newId = Math.floor(Math.random() * 1000000).toString();
    isDuplicate = persons.some((person) => person.id === newId);
  }
  return newId;
};

//get all persons
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

//info route
app.get("/info", (req, res) => {
  Person.countDocuments({}).then((count) => {
    const date = new Date();
    res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
        `);
  });
});

//adding a new person
app.post("/api/persons", (req, res, next) => {
  const newPerson = req.body;

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({
      error: "name or number is missing",
    });
  }

  Person.findOne({ name: newPerson.name })
    .then((existingPerson) => {
      if (existingPerson) {
        return res.status(400).json({
          error: "name must be unique",
        });
      }

      const person = new Person({
        name: newPerson.name,
        number: newPerson.number,
      });

      person.save().then((savedPerson) => {
        res.json(savedPerson);
      });
    })
    .catch((error) => next(error));
});

//update a person number
app.put("/api/persons/:id", (req, res, next) => {
  const newNumber = req.body.number;
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        person.number = newNumber;
        person.save().then((updatedPerson) => {
          res.json(updatedPerson);
        });
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//getting a single person
app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//deleting a person
app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  {
    res.status(404).send({ error: "unknown endpoint" });
  }
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.message === "castError") {
    return res.status(404).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
