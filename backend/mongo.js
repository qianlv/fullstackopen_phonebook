const mongoose = require('mongoose')

if (process.argv.length === 3 && process.argv.length === 4) {
  console.log(`Usage: node ${process.argv[1]} [password] [name] [number]}`)
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://qianlv7:${password}@cluster0.glqdu.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length === 5) {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })
    person.save().then(() => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
  } else {
    Person.find({}).then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })

    }).catch(error => {
      console.log(`error ${error}`)
    }).finally(() => {
      mongoose.connection.close()
    })
  }

})

