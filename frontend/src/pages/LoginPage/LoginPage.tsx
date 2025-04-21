import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { LOGIN_MUTATION } from "../../graphql/mutations/login";
import InputField from "../../components/ImputField/ImputField";
import "./LoginPage.scss";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginFormValues>();
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const [welcomeMsg, setWelcomeMsg] = useState("");

  const onSubmit = async (formData: LoginFormValues) => {
    try {
      const response = await login({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      const token = response.data.login.token;
      const user = response.data.login.user;

      localStorage.setItem("token", token);
      setWelcomeMsg(`Welcome ${user.username} 👋`);
    } catch (error: any) {
      alert("Erreur de connexion : " + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <h1 className="login-page__title">Connexion</h1>

        {welcomeMsg && <p className="login-page__welcome">{welcomeMsg}</p>}

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
