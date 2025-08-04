import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

// MovieCard: Displays a single movie's details and links to detail page
function MovieCard({ movie }) {
  return (
    <div style={{ border: "1px solid #ccc", margin: 10, padding: 10, width: 250 }}>
      <Link to={`/movie/${encodeURIComponent(movie.title)}`} style={{ textDecoration: "none", color: "inherit" }}>
        <img src={movie.posterURL} alt={movie.title} style={{ width: "100%" }} />
        <h3>{movie.title}</h3>
        <p><strong>Rating:</strong> {movie.rating}</p>
      </Link>
    </div>
  );
}

// MovieList: Renders a list of MovieCard components
function MovieList({ movies }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {movies.map((movie) => (
        <MovieCard key={movie.title + movie.rating} movie={movie} />
      ))}
    </div>
  );
}

// Filter: Allows filtering movies by title and rating
function Filter({ filterTitle, setFilterTitle, filterRating, setFilterRating }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Filter by title"
        value={filterTitle}
        onChange={(e) => setFilterTitle(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <input
        type="number"
        placeholder="Minimum rating"
        min="0"
        max="10"
        value={filterRating}
        onChange={(e) => setFilterRating(Number(e.target.value))}
        style={{ width: 120 }}
      />
    </div>
  );
}

// AddMovie: Form to add a new movie
function AddMovie({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterURL, setPosterURL] = useState("");
  const [rating, setRating] = useState("");
  const [trailer, setTrailer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !posterURL || !rating || !trailer) return;
    onAdd({
      title,
      description,
      posterURL,
      rating: Number(rating),
      trailer,
    });
    setTitle("");
    setDescription("");
    setPosterURL("");
    setRating("");
    setTrailer("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ marginRight: 10 }}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={{ marginRight: 10 }}
      />
      <input
        type="url"
        placeholder="Poster URL"
        value={posterURL}
        onChange={(e) => setPosterURL(e.target.value)}
        required
        style={{ marginRight: 10 }}
      />
      <input
        type="number"
        placeholder="Rating"
        min="0"
        max="10"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
        style={{ width: 80, marginRight: 10 }}
      />
      <input
        type="url"
        placeholder="Trailer Embed URL"
        value={trailer}
        onChange={(e) => setTrailer(e.target.value)}
        required
        style={{ marginRight: 10 }}
      />
      <button type="submit">Add Movie</button>
    </form>
  );
}

// MovieDetail: Shows description and embedded trailer
function MovieDetail({ movies }) {
  const { title } = useParams();
  const navigate = useNavigate();
  const movie = movies.find(m => m.title === decodeURIComponent(title));

  if (!movie) {
    return (
      <div>
        <h2>Movie not found</h2>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>{movie.title}</h2>
      <img src={movie.posterURL} alt={movie.title} style={{ width: 300 }} />
      <p>{movie.description}</p>
      <div style={{ margin: "20px 0" }}>
        <iframe
          width="560"
          height="315"
          src={movie.trailer}
          title="Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}

// App: Main component, manages state and routing
function App() {
  // Initial movies with description and trailer
  const [movies, setMovies] = useState([
    {
      title: "Inception",
      description: "A thief who steals corporate secrets through dream-sharing technology.",
      posterURL: "https://m.media-amazon.com/images/I/51oDg+e1pDL._AC_.jpg",
      rating: 8.8,
      trailer: "https://www.youtube.com/embed/YoHD9XEInc0",
    },
    {
      title: "Breaking Bad",
      description: "A high school chemistry teacher turned methamphetamine producer.",
      posterURL: "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg",
      rating: 9.5,
      trailer: "https://www.youtube.com/embed/HhesaQXLuRY",
    },
  ]);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterRating, setFilterRating] = useState(0);

  // Add new movie
  const handleAddMovie = (movie) => {
    setMovies([...movies, movie]);
  };

  // Filter movies by title and rating
  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
      movie.rating >= filterRating
  );

  // Routing setup
  return (
    <Router>
      {/* Routes define which component renders for each path */}
      <Routes>
        {/* Home page route */}
        <Route
          path="/"
          element={
            <div style={{ padding: 30 }}>
              <h1>Movie App</h1>
              <AddMovie onAdd={handleAddMovie} />
              <Filter
                filterTitle={filterTitle}
                setFilterTitle={setFilterTitle}
                filterRating={filterRating}
                setFilterRating={setFilterRating}
              />
              <MovieList movies={filteredMovies} />
            </div>
          }
        />
        {/* Movie detail route with dynamic title param */}
        <Route
          path="/movie/:title"
          element={<MovieDetail movies={movies} />}
        />
      </Routes>
    </Router>
  );
}


export default App;