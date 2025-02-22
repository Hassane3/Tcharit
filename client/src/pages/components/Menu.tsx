import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// VARIABLES
import { customTheme, UserData } from "../../App";
// UI
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerProps,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import {
  Close,
  Languages,
  Logo,
  Notification,
  TankAgent,
  Settings,
  LogOut,
} from "../../utils/constants/Icons";
// DB
import { logoutUser } from "../../firebase/operations";
//COMPONENTS
import { Header, TopSection } from "../MapPage";
import { styled } from "styled-components";

interface menuProps {
  userData: UserData;
  anchorState: boolean;
  user: {} | null;
  anchor: DrawerProps["anchor"];
  toggleDrawer: (
    anchor: DrawerProps["anchor"],
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const Menu = (props: menuProps) => {
  const { userData, anchorState, user, anchor, toggleDrawer } = props;

  const [isAccountVisible, setIsAccountVisible] = useState<boolean>(false);
  const navigateTo = useNavigate();

  const menuLists = [
    // {
    //   name: "Cisterns",
    //   icon: <FullTank />,
    // },
    {
      name: "Notifications",
      link: "notifications",
      icon: (
        <Notification
          backgroundColor={customTheme.palette.background.defaultBlue}
        />
      ),
    },
  ];
  const listUserLoggedIn = () => {};

  const handleLogout = () => {
    try {
      logoutUser();
    } catch (error) {
      console.error("Error when login out : ", error);
    }
  };

  const handleShowAccount = () => {
    setIsAccountVisible(true);
  };
  return (
    <Drawer
      id="menuDrawer"
      anchor={anchor}
      open={anchorState}
      onClose={toggleDrawer(anchor, false)}
      sx={
        {
          // backgroundImage: "none",
        }
      }
      PaperProps={{
        sx: { backgroundColor: customTheme.palette.background.blueFade },
      }}
    >
      {/* {user ? listUserLoggedIn() : list()} */}
      <MenuContainer
        backgroundColor={customTheme.palette.background.defaultWhite}
        role="presentation"
        // onKeyDown={toggleDrawer(anchor, false)}
      >
        <TopSection>
          <Button
            sx={{
              padding: 0,
              flexDirection: "column",
              textTransform: "capitalize",
            }}
          >
            <Languages
              backgroundColor={customTheme.palette.background.defaultBlue}
            />
            <Typography variant="h4" color={customTheme.palette.text.primary}>
              English
            </Typography>
          </Button>
          <Button
            variant="text"
            onClick={toggleDrawer(anchor, false)}
            sx={{
              width: "fit-content",
              height: "fit-content",
              margin: "6px",
              zIndex: "1000",
              padding: "0",
              color: customTheme.palette.background.defaultBlue,
            }}
          >
            <Close
              backgroundColor={customTheme.palette.background.defaultBlue}
            />
          </Button>
        </TopSection>
        <div style={{ display: "grid", height: "100%", alignItems: "end" }}>
          <MenuList>
            <List>
              {menuLists.map((subList, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    sx={{ flexDirection: "column", alignItems: "end" }}
                    // onClick={() => navigateTo("/Login")}
                  >
                    <Box sx={{ display: "flex" }}>
                      <ListItemText primary={subList.name} sx={{ margin: 0 }} />
                      <ListItemIcon
                        sx={{
                          align: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* {subList.name === "Connect" && <AccountBoxIcon />} */}
                        {subList.icon}
                      </ListItemIcon>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </MenuList>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              alignSelf: "flex-end",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <div style={{ display: "flex column" }}>
              <Typography variant="h1">تشاريت</Typography>
              <Typography variant="h2">Tcharit</Typography>
            </div>
            <Logo />
          </div>
        </div>
      </MenuContainer>
      {/* Tank agent connexion */}
      {user ? (
        <AccountContainer>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                // flexDirection: "",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={handleShowAccount}
            >
              <Settings
                backgroundColor={customTheme.palette.background.defaultBlue}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <ListItemText
                  primary={"Account"}
                  sx={{
                    flex: "none",
                    color: customTheme.palette.background.defaultWhite,
                  }}
                />
                <ListItemIcon
                  sx={{
                    align: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TankAgent
                    backgroundColor={
                      customTheme.palette.background.defaultWhite
                    }
                  />
                </ListItemIcon>
              </Box>
            </ListItemButton>
          </ListItem>
          {isAccountVisible && (
            <Button
              variant="contained"
              size="small"
              onClick={handleLogout}
              sx={{
                backgroundColor: customTheme.palette.background.redDark,
                color: customTheme.palette.background.defaultWhite,
                borderRadius: "20px",
                paddingX: 2,
                alignSelf: "flex-start",
                "> *": {
                  paddingX: 0.6,
                },
              }}
            >
              <LogOut
                backgroundColor={customTheme.palette.background.defaultWhite}
              />
              Logout
            </Button>
          )}
          {/* <Divider /> */}
          {/* <ListItem sx={{ justifyContent: "end" }}>
            <Button variant="contained" onClick={handleLogout}>
              logout
            </Button>
          </ListItem> */}
        </AccountContainer>
      ) : (
        <AccountContainer>
          <p
            style={{
              fontSize: "14px",
              textDecoration: "underline",
              color: customTheme.palette.background.lightWhite,
            }}
          >
            Reserved for cistern fillers
          </p>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                flexDirection: "column",
                alignItems: "start",
              }}
              onClick={() => navigateTo("/Login")}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <ListItemText
                  primary={"Account"}
                  sx={{
                    flex: "none",
                    color: customTheme.palette.background.lightWhite,
                  }}
                />
                <ListItemIcon
                  sx={{
                    align: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TankAgent
                    backgroundColor={customTheme.palette.background.lightWhite}
                  />
                </ListItemIcon>
              </Box>
            </ListItemButton>
          </ListItem>
        </AccountContainer>
      )}
    </Drawer>
  );
};

const MenuContainer = styled.div<{ backgroundColor: string }>`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.backgroundColor};
  padding: 16px;
  height: 100%;
  border-radius: 0 0 30px 30px;
`;

const MenuList = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 16px;
  /* height: 100%; */
`;
export default Menu;
