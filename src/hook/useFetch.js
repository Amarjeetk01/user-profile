import { useEffect, useState } from "react";

const useFetch = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      setUser(null);
      try {
        const data = await JSON.parse(localStorage.getItem("user"));
        setUser(data);
        setLoading(false);
      } catch (err) {
        // console.log(err)
        setLoading(false);
        setError("Something went wrong");
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export default useFetch;
