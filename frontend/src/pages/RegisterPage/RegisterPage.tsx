import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useApolloClient } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { REGISTER_MUTATION } from "../../graphql/mutations/register";
import { LOGIN_MUTATION } from "../../graphql/mutations/login";
import InputField from "../../components/ImputField/ImputField";
import { isStrongPassword } from "../../utils/validators";
import { EyeOnIcon, EyeOffIcon } from "../../utils/iconList";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterPage.scss";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({ mode: "onTouched" });

  const [registerUser] = useMutation(REGISTER_MUTATION);
  const [loginUser] = useMutation(LOGIN_MUTATION);
  const apolloClient = useApolloClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (formData: RegisterFormValues) => {
    if (!isStrongPassword(formData.password)) {
      setError("password", {
        type: "manual",
        message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    try {
      await registerUser({
        variables: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
      });

      await loginUser({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      await apolloClient.refetchQueries({
        include: ["Me"],
      });

      toast.success("Inscription réussie !");
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      setError("email", {
        type: "manual",
        message: error.message,
      });
    }
  };

  return (
    <div className="register-page">
      <div className="register-page__container">
        <h1 className="register-page__title">Inscription</h1>

        <form className="register-page__form" onSubmit={handleSubmit(onSubmit)}>
          <InputField name="username" type="text" placeholderKey="Identifiant" register={register} required ariaLabel="Identifiant" />
          <InputField name="email" type="email" placeholderKey="Email" register={register} required ariaLabel="Email" />

          <div className="input-field-wrapper">
            <input
              className="input__login-page"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              {...register("password", { required: true })}
              aria-label="Mot de passe"
              aria-required="true"
            />
            <button
              type="button"
              className="input-field-wrapper__toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeOnIcon />}
            </button>
          </div>

          <div className="input-field-wrapper">
            <input
              className="input__login-page"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              {...register("confirmPassword", { required: true })}
              aria-label="Confirmer le mot de passe"
              aria-required="true"
            />
            <button
              type="button"
              className="input-field-wrapper__toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Cacher la confirmation" : "Afficher la confirmation"}
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeOnIcon />}
            </button>
          </div>

          {errors.confirmPassword && <p className="register-page__error">{errors.confirmPassword.message}</p>}
          {errors.password && <p className="register-page__error">{errors.password.message}</p>}

          <button type="submit" className="register-page__button">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
