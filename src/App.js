import { useState, useRef, useCallback } from "react";
import "./App.css";
import { BookSearch } from "./components/BookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, books, hasMore } = BookSearch(query, pageNumber);
  const observer = useRef();

  const lastBookElementRef = useCallback(node => {
    if(loading) return 
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore)
      setPageNumber(prevPageNumber => prevPageNumber + 1)
    })
    if(node) observer.current.observe(node)
  }, [loading, hasMore])

  const handleSearch = (e) => {
    console.log(e.target.value);
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className="App">
      <input type="text" value={query} onChange={handleSearch}></input>
      {books.map((book, index) => {
        if(books.length === index + 1){
          return  <div ref={lastBookElementRef} key={book}>{book}</div>
        }
       return <div key={book}>{book}</div>
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error..."}</div>
    </div>
  );
}

export default App;
