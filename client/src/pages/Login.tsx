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
} from "@mui/material";
import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { useNavigate } from "react-router-dom";
import { customTheme } from "../App";

interface loginProps {
  handleSetTankAgentData: ({}) => void;
}

const Login = (props: loginProps) => {
  const { handleSetTankAgentData } = props;
  const providers = [{ id: "credentials", name: "Email and Password" }];

  // ...
  // const [tankAgentData, setTankAgentData] = useState<{}>();
  const navigateTo = useNavigate();
  const signIn: (
    provider: AuthProvider,
    formData: FormData
  ) => Promise<AuthResponse> | void = (provider, formData) => {
    const promise = new Promise<AuthResponse>(async (resolve) => {
      //   setTimeout(() => {
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
          }
        );
      }
      resolve({
        type: "CredentialsSignin",
        error: "Invalid credentials.",
      });
      //   }, 300);
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
        />
      </FormControl>
    );
  }

  function CustomButton() {
    return (
      <Button
        type="submit"
        variant="contained"
        size="small"
        // disableElevation
        fullWidth
        sx={{
          my: 2,
          backgroundColor: customTheme.palette.background.blue,
          color: customTheme.palette.text.secondary,
        }}
      >
        Log In
      </Button>
    );
  }

  function ForgotPasswordLink() {
    return (
      <Link href="/" variant="body2">
        Forgot password?
      </Link>
    );
  }

  function Title() {
    return <h2 style={{ marginBottom: 8 }}>Login</h2>;
  }

  return (
    <div
      style={{
        backgroundColor: customTheme.palette.background.blueLight,
      }}
    >
      <Box>
        <Button onClick={() => navigateTo("/mapPage")}>
          <ArrowBackIosIcon />
        </Button>
      </Box>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slots={{
          title: Title,
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          forgotPasswordLink: ForgotPasswordLink,
        }}
        sx={{
          "& .MuiTypography-root": {
            color: customTheme.palette.background.defaultWhite,
          },
          "& .MuiSvgIcon-root": {
            color: customTheme.palette.background.defaultWhite,
          },
        }}
      />
    </div>
  );
};

export default Login;
