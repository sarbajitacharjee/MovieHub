import React, { useState, useEffect } from "react";

const MovieSearchApp = () => {
  const [query, setQuery] = useState("");
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState([]);

  const API_KEY = "f6b87695"; //  OMDB API key

  // Recommended movie titles
  const defaultMovies = [
    "Inception",
    "Interstellar",
    "The Dark Knight",
    "Avatar",
    "Titanic",
    "Avengers: Endgame",
    "Joker",
    "John wick",
    "stree",
    "war 2"
  ];

  // Fetch recommended movies on load
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const promises = defaultMovies.map((title) =>
          fetch(`https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`).then(
            (res) => res.json()
          )
        );
        const results = await Promise.all(promises);
        setRecommended(results.filter((m) => m.Response === "True"));
      } catch (err) {
        console.error("Error loading recommended movies", err);
      }
    };
    fetchRecommended();
  }, );

  // Search movie
  const fetchMovie = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    setMovie(null);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?t=${query}&apikey=${API_KEY}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        setMovie(data);
        setError("");
      } else {
        setMovie(null);
        setError("❌ Not found any movie with this title");
      }
    } catch (err) {
      setError("⚠️ Error fetching movie data.");
      setMovie(null);
    } finally {
      setLoading(false);
      setQuery(""); 
    }
  };

  // Add function to fetch by IMDb ID
const fetchMovieById = async (imdbID) => {
  setLoading(true);
  setError("");
  setMovie(null);

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
    );
    const data = await res.json();

    if (data.Response === "True") {
      setMovie(data);
    } else {
      setError("❌ Could not load movie details");
    }
  } catch (err) {
    setError("⚠️ Error fetching movie details.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-yellow-400 mt-10 mb-6 text-center">
        🎬 Movie Finder
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={fetchMovie}
        className="flex w-full max-w-xl mb-10 shadow-lg"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="flex-1 px-4 py-3 rounded-l-lg text-black focus:outline-none"
        />
        <button
          type="submit"
          className="bg-yellow-500 px-6 py-3 rounded-r-lg hover:bg-yellow-600 transition"
        >
          Search
        </button>
      </form>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="w-12 h-12 border-4 border-yellow-400 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error */}
      {!loading && error && !movie && (
        <p className="text-red-500 font-semibold text-xl text-center mt-10">
          {error}
        </p>
      )}

      {/* Movie Details */}
      {!loading && movie && (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 max-w-4xl w-full mb-12">
          {/* Poster */}
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.jpg"}
            alt={movie.Title}
            className="w-64 h-auto rounded-lg shadow-md"
          />

          {/* Details */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{movie.Title}</h2>
            <p className="text-gray-400 italic mb-4">
              {movie.Year} • {movie.Runtime} • {movie.Rated}
            </p>
            <p className="mb-3">{movie.Plot}</p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="font-semibold">Genre:</span> {movie.Genre}</p>
              <p><span className="font-semibold">Director:</span> {movie.Director}</p>
              <p><span className="font-semibold">Writer:</span> {movie.Writer}</p>
              <p><span className="font-semibold">Actors:</span> {movie.Actors}</p>
              <p><span className="font-semibold">Language:</span> {movie.Language}</p>
              <p><span className="font-semibold">Country:</span> {movie.Country}</p>
              <p><span className="font-semibold">Awards:</span> 🏆 {movie.Awards}</p>
              <p><span className="font-semibold">Box Office:</span> 💰 {movie.BoxOffice}</p>
              <p><span className="font-semibold">Metascore:</span> {movie.Metascore}</p>
              <p><span className="font-semibold">IMDB Rating:</span> ⭐ {movie.imdbRating}</p>
            </div>

            <a
              href={`https://www.imdb.com/title/${movie.imdbID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-yellow-400 hover:underline"
            >
              View on IMDb →
            </a>
          </div>
        </div>
      )}

      {/* Recommended Movies */}
{!loading && !error && (
  <div className="w-full max-w-6xl">
    <h2 className="text-2xl font-bold mb-6 text-yellow-400">
      ⭐ Recommended Movies
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {recommended.map((rec) => (
        <div
          key={rec.imdbID}
          onClick={() => fetchMovieById(rec.imdbID)}
          className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:scale-105 transform transition cursor-pointer"
        >
          <img
            src={rec.Poster !== "N/A" ? rec.Poster : "/no-poster.jpg"}
            alt={rec.Title}
            className="w-full h-72 object-cover"
          />
          <div className="p-3">
            <h3 className="text-sm font-semibold">{rec.Title}</h3>
            <p className="text-gray-400 text-xs">{rec.Year}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default MovieSearchApp;
