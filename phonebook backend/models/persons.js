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
    number: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                if (v.length > 8) return false;
                return /^\d{2,3}-\d+$/.test(v);

            },
            message: props => `${props.value} is not a valid number!
            Format: XX-XXXXXXX or XXX-XXXXXXXX`
        }
    }
});

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model('Person', phonebookSchema)