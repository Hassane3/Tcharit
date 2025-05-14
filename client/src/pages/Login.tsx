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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";

import { useNavigate } from "react-router-dom";
import { customTheme } from "../App";

interface loginProps {
  handleSetTankAgentData: ({}) => void;
}

const Login = (props: loginProps) => {
  const { handleSetTankAgentData } = props;
  const providers = [{ id: "credentials", name: "Email and Password" }];

  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleClick() {
    setIsLoading(true);
  }
  // ...
  // const [tankAgentData, setTankAgentData] = useState<{}>();
  const navigateTo = useNavigate();

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
              console.log("error authentication");
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
        label="Email"
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
          Password
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
          // backgroundColor: customTheme.palette.background.default,
          // color: customTheme.palette.text.primary,
        }}
      >
        Log In
      </Button>
    );
  }

  function Title() {
    return (
      <Typography variant="h2" style={{ marginBottom: 8 }}>
        Login
      </Typography>
    );
  }

  function Subtitle() {
    return (
      <Typography variant="h5" style={{}}>
        Cistern agent ? Please sign in{" "}
      </Typography>
    );
  }

  function ForgotPasswordLink() {
    return (
      <Link
        href="/resetPassword"
        variant="body2"
        sx={{ color: customTheme.palette.text.grey }}
      >
        Forgot password?
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
          // If lang === arabic flex : 1 else 0
          // flex: 0,
          // justifyContent: "left",
          // alignItems: "flex-start",
          alignSelf: "flex-start",
        }}
      >
        <Button
          size="large"
          onClick={() => navigateTo("/", { state: { anchorState: true } })}
          sx={{ padding: 0 }}
        >
          <ChevronLeftRoundedIcon
            sx={{
              color: customTheme.palette.background.defaultBlue,
              fontSize: "50px",
            }}
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
          minHeight: "unset",
          height: "100%",

          // "& .MuiTypography-root": {
          //   color: customTheme.palette.background.default,
          // },
          // "& .MuiSvgIcon-root": {
          //   color: customTheme.palette.background.default,
          // },
        }}
      />
    </div>
  );
};

export default Login;
