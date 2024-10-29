const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log(`connect to ${url}`)

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(_result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (value) {
        if (value.length < 9) {
          return false;
        }
        const ret = /\d{2,3}-\d{5,}/.test(value)
        console.log('validator value ', ret)
        return ret
      },
      message: probs => `${probs.value} is not a valid phone number`,
    },
    required: [true, 'User phone number required'],
  }
})

personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
