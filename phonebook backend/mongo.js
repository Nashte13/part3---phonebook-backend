const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give a password as an argument')
        process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nash:${password}@cluster0.6xgmy0j.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, {family: 4}) //establishes connection to database

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = Note({
    content: 'Html is easy',
    important: true,
})

note.save().then(result => {
    console.log('note saved')
    mongoose.connection.close()
})
