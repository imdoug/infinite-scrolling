import axios from "axios";
import { useEffect, useState } from "react";

export const BookSearch = (query, pageNumber) => {
      const [loading,setLoading] = useState(true)
      const [error,setError] = useState(false)
      const [books,setBooks] = useState([])
      const [hasMore,setHasMore] = useState(false)
  let cancel;
  useEffect(()=>{
      setBooks([])
  }, [query])
  useEffect(() => {
        setLoading(true)
        setError(false)
    axios
      .get("http://openlibrary.org/search.json", {
        params: { q: query, page: pageNumber },
        cancelToken: new axios.CancelToken(c => cancel = c)
      }).then((res) => {
            setBooks(prevBooks => {
                  return [...new Set ([...prevBooks, ...res.data.docs.map( b => b.title)])]
            })
            setHasMore(res.data.docs.length > 0)
            setLoading(false)
        console.log(res.data);
      }).catch(err =>{
            // ignore the requrest cancelations
            if(axios.isCancel(err)) return
            setError(true)
      })
      return () => cancel()
  }, [query, pageNumber]);

  return { loading, error, books, hasMore }
};
