import { useState, useEffect } from "react";
import axios from "axios";

const useAxiosFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let source = axios.CancelToken.source();
    setLoading(true);
    axios
      .get(url, {
        cancelToken: source.token,
      })
      .then((a) => {
        console.log("here");
        setData(a);
        setLoading(false);
      })
      .catch(function (thrown) {
        //put catch after then
        if (axios.isCancel(thrown)) {
          console.log(`request cancelled:${thrown.message}`);
        } else {
          console.log("another error happened");
          setData(null);
          setError(thrown);
        }
        // throw (thrown)
      });

    if (source) {
      console.log("source defined");
    } else {
      console.log("source NOT defined");
    }

    return function () {
      console.log("cleanup of useAxiosFetch called");
      if (source) {
        console.log("source in cleanup exists");
      } else {
        source.log("source in cleanup DOES NOT exist");
      }
      source.cancel("Cancelling in cleanup");
    };
  }, []);

  return { data, loading, error };
};

export default useAxiosFetch;
