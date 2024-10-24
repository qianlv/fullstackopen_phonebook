import RemovePerson from './RemovePerson'

const Persons = ({ filterName, persons, setPersons, setError }) => {
  return (
    <>
      {
        persons
          .filter(person => person.name.includes(filterName))
          .map(person => {
            return (
              <div key={person.id}>
                {person.name} {person.number} <RemovePerson
                  key={person.id}
                  person={person}
                  persons={persons}
                  setPersons={setPersons}
                  setError={setError}
                />
              </div>
            )
          })
      }
    </>
  )
}

export default Persons
