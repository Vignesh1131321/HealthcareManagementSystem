import React from "react";
import styles from "./Auth.module.css";
import { InputFieldProps } from "./types";

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  id,
  showHidePassword,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={id} className={styles.inputLabel}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          type={showPassword ? "text" : type}
          id={id}
          className={styles.inputField}
          aria-label={label}
        />
        {showHidePassword && (
          <div
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            role="button"
            tabIndex={0}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4ea36f0aca050e4632d6e1d9cb6906a35c2cb5f33380461c9e4879de81fd41a5?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21"
              alt="Toggle password visibility"
              className={styles.hideIcon}
            />
          </div>
        )}
      </div>
    </div>
  );
};
