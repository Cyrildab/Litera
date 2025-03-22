import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_BOOK } from "../graphql/queries/getBook";

const BookDetail = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_BOOK, {
    variables: { id: Number(id) },
  });

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const { book } = data;

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      <img src={book.cover} alt={book.title} width={200} />
      <div>
        <h1>{book.title}</h1>
        <h2>{book.author}</h2>
        <h3>{book.gender}</h3>
        <p>{book.description}</p>
        <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
          <button style={{ backgroundColor: "#f7931e" }}>Lu</button>
          <button style={{ backgroundColor: "#f5d7aa" }}>En cours</button>
          <button style={{ backgroundColor: "#e0d3c0" }}>Abandonné</button>
          <button style={{ backgroundColor: "#f3dfc1" }}>À lire</button>
        </div>
        <a href="#">Voir les critiques (4.38★)</a>
      </div>
    </div>
  );
};

export default BookDetail;
