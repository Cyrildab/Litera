import { useForm } from "react-hook-form";
import InputField from "../../components/ImputField/ImputField";
import "./RegisterPage.scss";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const { register, handleSubmit } = useForm<RegisterFormValues>();

  const onSubmit = (formData: RegisterFormValues) => {
    console.log("Register Form Data:", formData);
    alert("Inscription simulée !");
  };

  return (
    <div className="register-page">
      <div className="register-page__container">
        <h1 className="register-page__title">Inscription</h1>

        <form className="register-page__form" onSubmit={handleSubmit(onSubmit)}>
          <InputField name="username" type="text" placeholderKey="Identifiant" register={register} required ariaLabel="Identifiant" />
          <InputField name="email" type="email" placeholderKey="Email" register={register} required ariaLabel="Email" />
          <InputField name="password" type="password" placeholderKey="Mot de passe" register={register} required ariaLabel="Mot de passe" />

          <button type="submit" className="register-page__button">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
