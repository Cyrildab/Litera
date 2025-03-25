import "./ImputField.scss";

interface InputFieldProps {
  name: string;
  type: string;
  placeholderKey: string;
  register: any;
  required?: boolean;
  ariaLabel: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, type, placeholderKey, register, required = false, ariaLabel }) => {
  return (
    <input
      className="input__login-page"
      {...register(name, { required })}
      aria-label={ariaLabel}
      aria-required={required}
      type={type}
      placeholder={placeholderKey}
    />
  );
};

export default InputField;
