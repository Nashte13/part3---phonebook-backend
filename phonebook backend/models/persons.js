const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give a password as an argument')
        process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

console.log('Connecting to url:', url);

mongoose.connect(url, {family: 4}) //establishes connection to database
.then(result => {
    console.log('Connected to MongoDB')
})
.catch(err => {
    console.log('error connecting to mongoDB:', err.message)
})

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model('Person', phonebookSchema)