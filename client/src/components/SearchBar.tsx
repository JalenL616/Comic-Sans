import './SearchBar.css'

export function SearchBar() {
    function search(formData: FormData) {
        const query = formData.get("query");
        alert(`You searched for '${query}'`);
    }
    return (
        <form action={search} className="search-form">
          <label htmlFor="query" className="visually-hidden">
            Search comics:
          </label>
          <input 
            id="query" 
            type="text" 
            name="query" 
            placeholder="Enter comic UPC"
          />
          <button type="submit">Search</button>
        </form>
    );
}