import { Routes, Route } from "react-router-dom";
import BookList from "./components/BookList";
import BookDetail from "./components/BookDetail";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>
    </div>
  );
}

export default App;
