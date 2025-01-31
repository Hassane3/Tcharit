import React, { JSX } from "react";
import styled from "styled-components";
import TankStatus from "../../models/utils/TankStatus";
import { Box, Button, Modal, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { customTheme } from "../../App";

interface PopUpProps {
  tankStatus: TankStatus;
  isConfirmBoxOpen: boolean;
  // handleClose: () => void;
  addPost: (status: TankStatus) => void;
  setConfirmationBox: (
    state: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const PopUp = (props: PopUpProps): JSX.Element => {
  const { tankStatus, isConfirmBoxOpen, addPost, setConfirmationBox } = props;
  return (
    <ModalContainer
      open={isConfirmBoxOpen}
      onClose={setConfirmationBox(false)}
      // aria-labelledby="parent-modal-title"
      // aria-describedby="parent-modal-description"
    >
      <BoxContainer
        backgroundColor={customTheme.palette.background.blue}
        textColor={customTheme.palette.text.secondary}
      >
        <Button
          onClick={setConfirmationBox(false)}
          sx={{
            display: "flex",
            alignSelf: "end",
            minWidth: "unset",
            color: customTheme.palette.background.defaultBlue,
          }}
        >
          <CloseRoundedIcon fontSize="large" />
        </Button>
        <div>
          <Typography variant="h3">
            Are u sure u want to prevent that the cistern is {tankStatus}
          </Typography>
          <span>
            (After you add a post, you cannot delete it and you will not able to
            add a new post until few minutes)
          </span>
          <Button
            onClick={() => {
              addPost(tankStatus);
            }}
            sx={{
              backgroundColor: customTheme.palette.background.defaultBlue,
              color: customTheme.palette.background.defaultWhite,
            }}
          >
            <span>Yes</span>
          </Button>
        </div>
      </BoxContainer>
    </ModalContainer>
  );
};

const ModalContainer = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const BoxContainer = styled(Box)<{
  backgroundColor: string;
  textColor: string;
}>`
  margin: 40px;
  border-radius: 10px;
  background-color: ${(props) => props.backgroundColor};
  text-align: center;
  display: flex column;
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.textColor};
    padding: 0 20px;
  }
  > button {
    justify-self: flex-end;
  }
  div > * {
    margin-bottom: 20px;
  }
  > span {
    font-size: 1em;
  }
`;

export default PopUp;
