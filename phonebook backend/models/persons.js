const mongoose = require('mongoose');



const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

console.log('Connecting to url:', url);

mongoose.connect(url, {family: 4}) //establishes connection to database
.then(result => {
    console.log('Connected to MongoDB')
})
.catch(error => {
    console.log('error connecting to mongoDB:', error.message)
})

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
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