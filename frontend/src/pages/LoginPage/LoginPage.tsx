import { useForm } from "react-hook-form";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN_MUTATION } from "../../graphql/mutations/login";
import InputField from "../../components/ImputField/ImputField";
import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.scss";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginFormValues>();
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const { user } = useUser();
  const navigate = useNavigate();
  const apolloClient = useApolloClient();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (formData: LoginFormValues) => {
    try {
      const { data } = await login({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      await apolloClient.refetchQueries({
        include: ["Me"],
      });

      toast.success(`Bienvenue ${data.login.user.username} !`);
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      toast.error("Erreur : " + err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <h1 className="login-page__title">Connexion</h1>

        <form className="login-page__form" onSubmit={handleSubmit(onSubmit)}>
          <InputField name="email" type="email" placeholderKey="Email" register={register} required ariaLabel="Email" />
          <InputField name="password" type="password" placeholderKey="Mot de passe" register={register} required ariaLabel="Mot de passe" />

          <button type="submit" className="login-page__button" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
