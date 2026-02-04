const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give a password as an argument')
        process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://nash:${password}@cluster0.6xgmy0j.mongodb.net/phonebookApp?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, {family: 4}) //establishes connection to database

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number);
        });
        mongoose.connection.close()
    });
} else if (process.argv.length === 5) {
    //adding a person in the command
    const person = new Person({
        name: name,
        number: number,
    });
    person.save().then(() => {{
        console.log(`added ${name} ${number} to phonebook`);
        mongoose.connection.close()
    }});
} else {
    console.log('Usage: node mongo.js <password> [name, number]');
    mongoose.connection.close();
}
