import personsService from '../services/persons'

const PersonForm = ({ newName, newPhone, setNewName, setNewPhone, persons, setPersons, setMessage, setError }) => {
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newPhone,
    }
    let person = persons.find((person) => person.name === newName)
    if (person !== undefined) {
      console.log(person)
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one`)) {
        newPerson.id = person.id
        personsService.update(person.id, newPerson)
          .then(returnPerson => {
            console.log("returnPerson ", returnPerson)
            setMessage(`Updated ${returnPerson.name}`)
            setTimeout(() => setMessage(null), 5000)
            setPersons(persons.map(person => person.id === returnPerson.id ? returnPerson : person))
          })
          .catch(error => {
            setError(error.response.data.error)
            console.log(error.response.data.error)
          })
      }
      return
    }

    personsService.create(newPerson)
      .then(returnPerson => {
        setPersons(persons.concat(returnPerson))
        setMessage(`Added ${returnPerson.name}`)
        setTimeout(() => setMessage(null), 5000)
        setNewName('')
        setNewPhone('')
      })
      .catch(error => {
        setError(error.response.data.error)
        console.log(error.response.data.error)
      })

  }

  return (
    <form>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>number: <input value={newPhone} onChange={handlePhoneChange} /></div>
      <div>
        <button type="submit" onClick={addPerson}>add</button>
      </div>
    </form>
  )
}

export default PersonForm
