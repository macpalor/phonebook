const mongoose = require('mongoose')

const len = process.argv.length

if (len !== 3 && len !== 5) {
    console.log('Usage:')
    console.log(`'node mongo.js <yourpassword>' to list entries in the phonebook`)
    console.log(`'node mongo.js <yourpassword> <name> <number>' to add a person`)
    process.exit()
} 

const password = process.argv[2]


const url = `mongodb+srv://macpalor:${password}@cluster0.sudywa4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find().then(result => {
        console.log('phonebook:')
        result.forEach(item => console.log(`${item.name} ${item.number}`))
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })
    
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
