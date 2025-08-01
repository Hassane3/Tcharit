import React, { useState } from "react";
import {
  AuthProvider,
  AuthResponse,
  SignInPage,
} from "@toolpad/core/SignInPage";
import { tankAgentSignIn } from "../firebase/operations";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { customTheme } from "../App";
import { useTranslation } from "react-i18next";
import { ArrowBack } from "../utils/constants/Icons";

interface loginProps {
  handleSetTankAgentData: ({}) => void;
}
const Login = (props: loginProps) => {
  const { handleSetTankAgentData } = props;
  const providers = [{ id: "credentials", name: "Email and Password" }];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  const navigateTo = useNavigate();
  let lang = localStorage.getItem("language");

  const signIn: (
    provider: AuthProvider,
    formData: FormData
  ) => Promise<AuthResponse> | void = (provider, formData) => {
    const promise = new Promise<AuthResponse>(async (resolve) => {
      setIsLoading(true);
      const email = formData?.get("email");
      const password = formData?.get("password");
      //call firebase fonction that verify if mail and psw exists. if true --> connect else --> show error connection
      if (email && password) {
        await tankAgentSignIn(email.toString(), password.toString()).then(
          (response) => {
            if (response.user) {
              resolve({ success: "true" });
              handleSetTankAgentData(response.user);
              navigateTo("/");
            } else {
              console.log(t("errors.someting_went_wrong"));
            }
            setIsLoading(false);
          }
        );
      }
      resolve({
        type: "CredentialsSignin",
        error: "Invalid credentials.",
      });
    });
    return promise;
  };

  function CustomEmailField() {
    return (
      <TextField
        id="input-with-icon-textfield"
        label={t("Login.email")}
        name="email"
        type="email"
        size="small"
        required
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle fontSize="inherit" />
              </InputAdornment>
            ),
          },
        }}
        variant="outlined"
        sx={{
          "& .MuiFormLabel-root": {
            color: customTheme.palette.text.grey,
          },
          "& .MuiInputBase-root": {
            fontFamily: "Poppins",
          },
        }}
      />
    );
  }

  function CustomPasswordField() {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent) => {
      event.preventDefault();
    };

    return (
      <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
        <InputLabel
          size="small"
          htmlFor="outlined-adornment-password"
          sx={{ color: customTheme.palette.text.grey }}
        >
          {t("Login.password")}
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          name="password"
          size="small"
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="small"
              >
                {showPassword ? (
                  <VisibilityOff fontSize="inherit" />
                ) : (
                  <Visibility fontSize="inherit" />
                )}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          sx={{ fontFamily: "Poppins" }}
        />
      </FormControl>
    );
  }

  function CustomButton() {
    return (
      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={isLoading}
        // disableElevation
        fullWidth
        sx={{
          my: 2,
        }}
      >
        {t("Login.login")}
      </Button>
    );
  }

  function Title() {
    return (
      <Typography variant="h2" style={{ marginBottom: 8 }}>
        {t("Login.title")}
      </Typography>
    );
  }

  function Subtitle() {
    return (
      <Typography variant="h5" style={{ textAlign: "center" }}>
        {t("Login.subtitle")}
      </Typography>
    );
  }

  function ForgotPasswordLink() {
    return (
      <Link
        href="/reset-password"
        variant="body2"
        sx={{
          color: customTheme.palette.text.grey,
        }}
      >
        {t("Login.forgot_password")}
      </Link>
    );
  }

  function RememberMe() {
    return <></>;
  }
  return (
    <div
      style={{
        backgroundColor: customTheme.palette.background.lightWhite,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          flex: 0,
          justifyContent: "left",
          alignItems: "flex-start",
          margin: "10px",
        }}
      >
        <Button size="large" onClick={() => navigateTo(-1)} sx={{ padding: 0 }}>
          <ArrowBack
            backgroundColor={customTheme.palette.background.defaultBlue}
          />
        </Button>
      </div>

      <SignInPage
        signIn={signIn}
        providers={providers}
        slots={{
          title: Title,
          subtitle: Subtitle,
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          forgotPasswordLink: ForgotPasswordLink,
          rememberMe: RememberMe,
        }}
        sx={{
          "& .MuiBox-root": {
            borderRadius: "30px",
          },
          "& .MuiStack-root ": {
            justifyContent: lang === "ar" ? "flex-end" : "flex-start",
          },
          minHeight: "unset",
          height: "100%",
        }}
      />
    </div>
  );
};

export default Login;
