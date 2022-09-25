import "./Search.css";

function Search(searchInput: any, search: any) {
    return (
        <div className="search-bar">
        <input
            type="text"
            placeholder="Search for a Movie..."
            className="search"
            onChange={searchInput}
            onKeyPress={search}
        />
        </div>
    );
}

export default Search;
