import {
  TextField,
  Button,
  Alert,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { customTheme } from "../App";
import { useNavigate } from "react-router-dom";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { AuthProvider, SignInPage, type SignInPageProps } from "@toolpad/core";
import { AccountCircle } from "@mui/icons-material";

export default function ResetPassword() {
  // const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigateTo = useNavigate();

  // const handleSubmit = async () => {
  //   try {
  //     // Exemple avec Firebase
  //     setIsLoading(true);
  //     await sendPasswordResetEmail(auth, email).then(() => setIsLoading(false));
  //     setStatus("success");
  //   } catch (error) {
  //     console.error(error);
  //     setStatus("error");
  //     setIsLoading(false);
  //   }
  // };

  function Title() {
    return (
      <Typography variant="h3" style={{ marginBottom: 8 }}>
        Reset password
      </Typography>
    );
  }
  function Subtitle() {
    return (
      <Typography
        variant="h5"
        style={{ color: customTheme.palette.text.secondary }}
      >
        Enter your email adress
      </Typography>
    );
  }
  function CustomEmailField() {
    return (
      <TextField
        id="input-with-icon-textfield"
        label="Email"
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
        // onClick={handleSubmit}
        sx={{
          my: 2,
          // backgroundColor: customTheme.palette.background.default,
          // color: customTheme.palette.text.primary,
        }}
      >
        Send email
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
        // Exemple avec Firebase
        setIsLoading(true);
        alert(email);
        await sendPasswordResetEmail(auth, email ? email : "").then(() =>
          setIsLoading(false)
        );
        setStatus("success");
        // resolve({ success: "true" });
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
          // height: "100%",
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
          // If lang === arabic flex : 1 else 0
          // flex: 0,
          // justifyContent: "left",
          alignItems: "flex-start",
        }}
      >
        <Button size="large" onClick={() => navigateTo(-1)} sx={{ padding: 0 }}>
          <ChevronLeftRoundedIcon
            sx={{
              color: customTheme.palette.background.defaultBlue,
              fontSize: "50px",
            }}
          />
        </Button>
      </div>
      {status === "success" && (
        <Alert severity="success" sx={{ mt: 2 }}>
          If this email exist in our system, you will receive an email from
          which you can reset your password.
        </Alert>
      )}
      {status === "error" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          An error occurred. Please try again.
        </Alert>
      )}
      <LoginPage />
    </div>
  );
}
