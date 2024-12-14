import React, { JSX } from "react";
import styled from "styled-components";
import TankStatus from "../../models/utils/TankStatus";

interface PopUpProps {
  tankStatus: TankStatus;
  addPost: (status: TankStatus) => void;
  setIsConfirmBoxVisible: (arg: boolean) => void;
}

const PopUp = (props: PopUpProps): JSX.Element => {
  const { tankStatus, addPost, setIsConfirmBoxVisible } = props;
  return (
    <Container>
      <Box>
        <button onClick={() => setIsConfirmBoxVisible(false)}>close</button>
        <h3>Are u sure u want to prevent that the tank is {tankStatus}</h3>
        <span>blablabla</span>
        <button
          onClick={() => {
            addPost(tankStatus);
          }}
        >
          Yes
        </button>
      </Box>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Box = styled.div`
  width: 200px;
  height: 200px;
  background-color: beige;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default PopUp;
