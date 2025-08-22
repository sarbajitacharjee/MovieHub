import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MovieSearch from "./pages/MovieSearchApp";

function App() {
  return (
    <Router>
     
        <Routes>
          <Route path="/" element={<MovieSearch />} />
        </Routes>
    </Router>
  );
}

export default App;
