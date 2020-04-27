const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give pw as argument')
  process.exit(1)
} else if (process.argv.length < 4) {
  const pw = process.argv[2]
  const url = `mongodb+srv://frknn:${pw}@tripsharecluster-0knnd.mongodb.net/phonebook?retryWrites=true&w=majority`
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} - ${person.number}`)
      })
      mongoose.connection.close()
      process.exit(1)
    })

} else {
  const pw = process.argv[2]
  const name = process.argv[3]
  const number = process.argv[4]

  const url = `mongodb+srv://frknn:${pw}@tripsharecluster-0knnd.mongodb.net/phonebook?retryWrites=true&w=majority`
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  const newPerson = new Person({ name, number })

  newPerson
    .save()
    .then(result => {
      console.log(`added ${result.name} - ${result.number} to phonebook`)
      mongoose.connection.close()
      process.exit(1)
    })

}
