import React, { JSX } from "react";
import styled from "styled-components";
import TankStatus from "../../models/utils/TankStatus";
import { Box, Button, Modal, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { customTheme } from "../../App";
import { Close, Infos } from "../../utils/constants/Icons";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const tankStatusLng =
    tankStatus === TankStatus.EMPTY
      ? t("common.tank.tank_state.empty")
      : tankStatus === TankStatus.HALFFUll
        ? t("common.tank.tank_state.half_full")
        : t("common.tank.tank_state.full");
  return (
    <ModalContainer
      open={isConfirmBoxOpen}
      onClose={setConfirmationBox(false)}
      // aria-labelledby="parent-modal-title"
      // aria-describedby="parent-modal-description"
    >
      <BoxContainer
        backgroundColor={
          tankStatus === TankStatus.EMPTY
            ? customTheme.palette.background.redExtraLight
            : tankStatus === TankStatus.HALFFUll
              ? customTheme.palette.background.yellowExtraLight
              : customTheme.palette.background.blueExtraLight
        }
      >
        <Button
          onClick={setConfirmationBox(false)}
          sx={{
            minWidth: "unset",
            position: "absolute",
            top: 20,
            right: 20,
            padding: 0,
            color: customTheme.palette.background.defaultBlue,
          }}
        >
          <Close backgroundColor={customTheme.palette.background.defaultBlue} />
          {/* <CloseRoundedIcon fontSize="large" /> */}
        </Button>
        <div>
          <Infos
            backgroundColor={customTheme.palette.background.defaultBlue}
            width={22}
            height={22}
          />
          <Typography
            variant="h3"
            color={customTheme.palette.background.defaultBlue}
          >
            {/* Are you sure you want to prevent that the cistern is {tankStatus} */}
            {t("common.tank.tank_report_confirmation", { tankStatusLng })}
          </Typography>
          {/* <span style={{ color: customTheme.palette.background.defaultBlue }}>
            (After you add a post, you cannot delete it and you will not able to
            add a new post until few minutes)
          </span> */}
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              addPost(tankStatus);
            }}
            sx={{
              backgroundColor: customTheme.palette.background.defaultBlue,
              color: customTheme.palette.background.defaultWhite,
            }}
          >
            <span>{t("navigation.yes")}</span>
          </Button>
        </div>
      </BoxContainer>
    </ModalContainer>
  );
};

export const ModalContainer = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const BoxContainer = styled(Box)<{
  backgroundColor?: string;
}>`
  margin: 40px;
  padding: 20px;
  border-radius: 30px;
  width: 300px;
  min-height: 300px;
  background-color: ${(props) => props.backgroundColor};
  text-align: center;
  display: flex;
  justify-content: center;
  position: relative;

  > div {
    display: grid;
    flex-direction: column;
    justify-items: center;
    align-items: end;
  }
  div > * {
    margin: 10px;
  }
`;

export default PopUp;
