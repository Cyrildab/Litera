import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
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

  const onSubmit = async (formData: LoginFormValues) => {
    try {
      const { data } = await login({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      alert(`Welcome ${data.login.user.username} !`);
    } catch (err: any) {
      alert("Erreur : " + err.message);
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
