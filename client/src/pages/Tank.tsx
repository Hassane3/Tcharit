import React, { useState } from "react";
//MODELS
import TankStatus from "../models/utils/TankStatus";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const Tank = () => {
  const navigateTo = useNavigate();
  const idMarker = useParams();
  const [markerData, setMarkerData] = useState({});

  return (
    <div>
      <Header>
        <ArrowBox>
          <img
            src="/img/arrow.svg"
            alt=""
            onClick={() => navigateTo("/mapPage")}
          />
        </ArrowBox>
        <PopUpMainElements>
          <img id="tank_icon" src="/img/filled_tank.svg" alt="" />
          <div id="tank_text">
            <p id="tank_name">{}</p>
            <p id="tank_description">الخزان ممتلئ</p>
          </div>
        </PopUpMainElements>
      </Header>
    </div>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;
const PopUpMainElements = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-right: 20px;

  #tank_icon {
    height: 70px;
    /* width: 70px; */
  }

  #tank_text {
    margin-right: 10px;
    width: 100%;
  }

  #tank_text p {
    margin: 2px;
    text-align: right;
  }
  #tank_name {
    font-family: "lalezar";
    color: teal;
    font-size: 34px;
  }
  #tank_description {
    font-family: "changa";
    font-weight: 600;
    font-size: 18px;
  }
`;

const ArrowBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;
export default Tank;
