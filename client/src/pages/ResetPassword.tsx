import { TextField, Button, Alert, Typography } from "@mui/material";
import { useState } from "react";
import { customTheme } from "../App";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { AuthProvider, SignInPage, type SignInPageProps } from "@toolpad/core";
import { useTranslation } from "react-i18next";
import { ArrowBack } from "../utils/constants/Icons";

export default function ResetPassword() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigateTo = useNavigate();
  const { t } = useTranslation();

  function Title() {
    return (
      <Typography variant="h3" style={{ marginBottom: 8 }}>
        {t("Login.reset_password")}
      </Typography>
    );
  }
  function Subtitle() {
    return (
      <Typography
        variant="h5"
        style={{ color: customTheme.palette.text.secondary }}
      >
        {t("Login.enter_email")}
      </Typography>
    );
  }
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
        {t("Login.send_email")}
      </Button>
    );
  }
  const signIn: (
    provider: AuthProvider,
    formData: FormData
  ) => Promise<Response> | void = (provider, formData) => {
    const promise = new Promise(async (resolve) => {
      const email = formData?.get("email")?.toString();
      setIsLoading(true);
      try {
        setIsLoading(true);
        await sendPasswordResetEmail(auth, email ? email : "").then(() =>
          setIsLoading(false)
        );
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
        setIsLoading(false);
      }
      return promise;
    });
  };

  const providers = [{ id: "nodemailer", name: "Email" }];

  const LoginPage = (props: SignInPageProps) => {
    return (
      <SignInPage
        signIn={signIn}
        providers={providers}
        slots={{
          title: Title,
          subtitle: Subtitle,
          emailField: CustomEmailField,
          submitButton: CustomButton,
        }}
        sx={{
          "& .MuiBox-root": {
            borderRadius: "30px",
          },
          minHeight: "unset",
          flex: 1,
        }}
      />
    );
  };
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
      {status === "success" && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {t("Login.alert_succes")}
        </Alert>
      )}
      {status === "error" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {t("Login.alert_fail")}
        </Alert>
      )}
      <LoginPage />
    </div>
  );
}
