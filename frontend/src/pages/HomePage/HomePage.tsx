import { useQuery } from "@apollo/client";
import { useUser } from "../../context/userContext";
import { GET_USER_BOOKS } from "../../graphql/queries/getUserBooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./HomePage.scss";
import Feed from "../../components/Feed/Feed";

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

  if (!user) {
    return (
      <div className="homepage__content">
        <h1 className="homepage__title">Bienvenue sur LitEra 📚</h1>
        <p className="homepage__description">Créez un compte pour commencer à suivre vos lectures !</p>
      </div>
    );
  }

  return (
    <>
      <Feed />
    </>
  );
};

export default HomePage;
