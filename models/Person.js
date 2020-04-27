const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, required: true, unique: true, minlength: 8 }
})

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

personSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Person', personSchema)