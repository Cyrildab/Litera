import { useForm } from "react-hook-form";
import InputField from "../../components/ImputField/ImputField";
import "./LoginPage.scss";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginFormValues>();

  const onSubmit = (formData: LoginFormValues) => {
    console.log("Form Data:", formData);
    alert("Connexion simulée !");
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <h1 className="login-page__title">Connexion</h1>

        <form className="login-page__form" onSubmit={handleSubmit(onSubmit)}>
          <InputField name="email" type="email" placeholderKey="Email" register={register} required ariaLabel="Email" />
          <InputField name="password" type="password" placeholderKey="Mot de passe" register={register} required ariaLabel="Mot de passe" />

          <button type="submit" className="login-page__button">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
