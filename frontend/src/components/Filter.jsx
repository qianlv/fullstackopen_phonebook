const Filter = ({ filterName, setFilterName }) => {
  const handleFilterName = (event) => {
    setFilterName(event.target.value)
  }
  return (<form>
    <div>filter shown with<input value={filterName} onChange={handleFilterName} /></div>
  </form>)
}

export default Filter
