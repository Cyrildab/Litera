import { useQuery } from "@apollo/client";
import { useUser } from "../../context/userContext";
import { GET_USER_BOOKS } from "../../graphql/queries/getUserBooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./HomePage.scss";

const HomePage = () => {
  const { user } = useUser();
  const { data, refetch } = useQuery(GET_USER_BOOKS);
  const navigate = useNavigate();

  const books = data?.getUserBooks || [];

  const readCount = books.filter((book: any) => book.status === "READ").length;
  const inProgressCount = books.filter((book: any) => book.status === "IN_PROGRESS").length;
  const toReadCount = books.filter((book: any) => book.status === "TO_READ").length;

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  return (
    <div className="homepage">
      {user ? (
        <div className="homepage__content">
          <h1 className="homepage__title">Bienvenue {user.username} 📖</h1>
          <div className="homepage__stats">
            <div className="homepage__stat">
              <span className="homepage__number">{readCount}</span>
              <span className="homepage__label">Livres lus</span>
            </div>
            <div className="homepage__stat">
              <span className="homepage__number">{inProgressCount}</span>
              <span className="homepage__label">En cours</span>
            </div>
            <div className="homepage__stat">
              <span className="homepage__number">{toReadCount}</span>
              <span className="homepage__label">À lire</span>
            </div>
          </div>
          <button className="homepage__button" onClick={() => navigate("/books")}>
            Voir mes livres
          </button>
        </div>
      ) : (
        <div className="homepage__content">
          <h1 className="homepage__title">Bienvenue sur LitEra 📚</h1>
          <p className="homepage__description">Créez un compte pour commencer à suivre vos lectures !</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
