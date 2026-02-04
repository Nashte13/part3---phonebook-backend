const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give a password as an argument')
        process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nash:${password}@cluster0.6xgmy0j.mongodb.net/phonebookApp?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, {family: 4}) //establishes connection to database

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', phonebookSchema)

const person = new Person({
    name: 'Nahashon Mwangi',
    number: 715735827,
})

person.save().then(result => {
    console.log('person saved')
    mongoose.connection.close()
})

