import { useCallback, useState } from "react";
import { checkAndRequestGeolocation } from "../utils/methods/methods";
import { postsProps, tankDataProps } from "./MapPage";
import TankStatus from "../models/utils/TankStatus";
import { UserType } from "../models/utils/UsersType";
import { customTheme, UserData } from "../App";
import { setANewCistern } from "../firebase/operations";
import { Button, TextField, Typography } from "@mui/material";
import { Close, TemporaryTank } from "../utils/constants/Icons";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { CustomMarker } from "./components/CustomMarker";
import TankType from "../models/utils/TankType";
import UseSnackBar from "./components/UseSnackBar";
import { useMap } from "@vis.gl/react-google-maps";

interface footerProps {
  id: number;
  userData: UserData;
}

const Footer = (props: footerProps) => {
  const { id, userData } = props;

  const { t } = useTranslation();

  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  const [isTempoCisternOpen, setIsTempoCisternOpen] = useState<boolean>(false);
  const [geolocation, setGeolocation] = useState<GeolocationPosition>();

  enum TempoCisternBoxes {
    INFOS,
    COORDINATES,
    GLOBAL,
    CISTERN_NAME,
  }
  const [tempoCisternBox, setTempoCisternBox] = useState<TempoCisternBoxes>(
    TempoCisternBoxes.INFOS
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // MUI SnackBar
  const [isSnackOpen, setIsSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");

  const expandFooter = (isFooterExpanded: boolean) => {
    setIsFooterExpanded(!isFooterExpanded);
  };

  const handleTempoCistern = (state: boolean) => {
    setIsTempoCisternOpen(state);
  };

  const handleGetGeolocation = async () => {
    setIsLoading(true);
    checkAndRequestGeolocation()
      .then(() =>
        navigator.geolocation.getCurrentPosition((position) => {
          const userLatLng = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          // ANimate
          map?.setZoom(19);
          map?.panTo(userLatLng);
          setGeolocation(position);
          setTempoCisternBox(TempoCisternBoxes.COORDINATES);
        })
      )
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const [isEditing, setIsEditing] = useState(false);
  const [tempoCisternName, setTempoCisternName] = useState<string>(
    // t("common.mapPage.tempo_cistern.tempo_cistern") +
    "خزان مؤقت " + "- " + Math.floor(100 + Math.random() * 900)
  );

  const closeFooter = () => {
    setIsTempoCisternOpen(false);
    setTempoCisternBox(TempoCisternBoxes.INFOS);
    setGeolocation(undefined);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const map = useMap();

  const handleAddTempoCistern = useCallback(
    async (geolocation: GeolocationPosition) => {
      let date = new Date();
      let newPost: postsProps = {
        status: TankStatus.FULL,
        userType: UserType.TANKAGENT,
        userName: userData.name ? userData.name : null,
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        weekDay: date.toLocaleDateString([], { weekday: "long" }),
        postTime: date.getTime(),
      };
      let now = new Date().getTime();
      let tankId = id;
      let newCisternData: tankDataProps = {
        id: tankId,
        type: TankType.TEMPORARY,
        latin_name: tempoCisternName,
        arab_name: tempoCisternName,
        lastPostTime: now,
        // lastCheckTime: 0,
        latLng: {
          lat: geolocation.coords.latitude,
          lng: geolocation.coords.longitude,
        },
        status: TankStatus.FULL,
        posts: [newPost],
        tankAgentId: userData.id,
        lastTimeFilled: now,
      };
      try {
        await setANewCistern(tankId, newCisternData);
        setIsFooterExpanded(false);
        setIsTempoCisternOpen(false);
        const userLatLng = new google.maps.LatLng(
          geolocation.coords.latitude,
          geolocation.coords.longitude
        );
        map?.setZoom(19);
        map?.panTo(userLatLng);
        setGeolocation(geolocation);
        setTempoCisternBox(TempoCisternBoxes.COORDINATES);
        setGeolocation(undefined);
        setIsSnackOpen(true);
        setSnackMessage(t("common.mapPage.tempo_cistern.confirm_add"));
      } catch {
        alert(t("errors.someting_went_wrong"));
        setIsSnackOpen(true);
        setSnackMessage(t("common.mapPage.tempo_cistern.confirm_fail_add"));
        setTempoCisternBox(TempoCisternBoxes.INFOS);
      }
    },
    [id, userData, tempoCisternName, map, t]
  );

  // To be able to use mui icons in leaflet :
  // const createCustomIcon = (IconComponent: SvgIconComponent) => {
  //   // Render Material-UI icon as a string (HTML/SVG)
  //   const iconHTML = ReactDOMServer.renderToStaticMarkup(
  //     <div
  //       style={{
  //         marginTop: "5px",
  //         textAlign: "center",
  //         display: "grid",
  //         justifyContent: "center",
  //         justifyItems: "center",
  //         width: "100%",
  //       }}
  //       className="geoLocationContainer"
  //     >
  //       <GeoLocation />
  //     </div>
  //   );
  //   // Create a Leaflet divIcon using the rendered HTML
  //   return new DivIcon({
  //     html: iconHTML,
  //     iconSize: [34, 34],
  //     className: "custom-icon-class",
  //   });
  // };

  // const customIconn = createCustomIcon(GeoLocation);

  const lang = localStorage.getItem("language");

  return (
    <FooterContainer
      style={{
        zIndex: "30",
        height: isTempoCisternOpen
          ? tempoCisternBox === TempoCisternBoxes.INFOS ||
            tempoCisternBox === TempoCisternBoxes.GLOBAL
            ? 400 + (isEditing ? 100 : 0)
            : 200
          : 60,
        width: isTempoCisternOpen ? "100%" : isFooterExpanded ? "90%" : 60,
        backgroundColor: customTheme.palette.background.defaultWhite,

        position: "fixed",
        bottom: isTempoCisternOpen ? 0 : 10,
        left: isTempoCisternOpen ? 0 : "16px",
        transition: "500ms ease",
        borderTopLeftRadius: "30px",
        borderTopRightRadius: "30px",
        borderBottomRightRadius: isTempoCisternOpen ? 0 : "30px",
        borderBottomLeftRadius: isTempoCisternOpen ? 0 : "30px",

        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {
        geolocation && (
          <CustomMarker
            position={[
              geolocation.coords.latitude,
              geolocation.coords.longitude,
            ]}
          ></CustomMarker>
        )
        // )
      }
      {isTempoCisternOpen && tempoCisternBox === TempoCisternBoxes.INFOS ? (
        <div
          style={{
            margin: "40px",
            padding: "20px",
            height: 300,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => closeFooter()}
            sx={{
              minWidth: "unset",
              position: "absolute",
              top: 20,
              right: 20,
              padding: 0,
              color: customTheme.palette.background.defaultBlue,
            }}
          >
            <Close
              backgroundColor={customTheme.palette.background.defaultBlue}
            />
          </Button>
          <div>
            <TemporaryTank
              backgroundColor={customTheme.palette.background.lightWhite}
            />
            <Typography
              variant="h3"
              fontSize={18}
              color={customTheme.palette.background.lightWhite}
              textTransform={"initial"}
            >
              {t("common.mapPage.tempo_cistern.tempo_cistern")}
            </Typography>
          </div>
          <Typography variant="h3" color={customTheme.palette.text.primary}>
            {t("common.mapPage.tempo_cistern.info")}
          </Typography>
          <div>
            <Button
              loading={isLoading}
              variant="contained"
              size="large"
              onClick={() => {
                handleGetGeolocation();
              }}
              sx={{
                backgroundColor: customTheme.palette.background.defaultWhite,
                color: customTheme.palette.background.defaultBlue,
                border: "solid 3px",
                borderColor: customTheme.palette.background.lightWhite,
                textWrap: "nowrap",
              }}
            >
              <span>{t("common.mapPage.tempo_cistern.get_geolocation")}</span>
            </Button>
          </div>
        </div>
      ) : isTempoCisternOpen &&
        tempoCisternBox === TempoCisternBoxes.COORDINATES ? (
        <div
          style={{
            margin: "40px",
            padding: "4px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => closeFooter()}
            sx={{
              minWidth: "unset",
              position: "absolute",
              top: 20,
              right: 20,
              padding: 0,
              color: customTheme.palette.background.defaultBlue,
            }}
          >
            <Close
              backgroundColor={customTheme.palette.background.defaultBlue}
            />
          </Button>
          <Typography
            variant="h4"
            color={customTheme.palette.text.grey}
            style={{
              textWrap: "nowrap",
              padding: 20,
            }}
          >
            {t("common.mapPage.tempo_cistern.actual_coordonate")}
            <span
              style={{
                color: customTheme.palette.background.defaultBlue,
              }}
            >
              {geolocation?.coords.accuracy}
            </span>
          </Typography>
          <div
            style={{
              width: "100%",
              display: "flex",

              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => setTempoCisternBox(TempoCisternBoxes.INFOS)}
              sx={{
                backgroundColor: customTheme.palette.background.defaultWhite,
                color: customTheme.palette.background.red,
                border: "solid 3px",
                borderColor: customTheme.palette.background.red,
              }}
            >
              {t("navigation.cancel")}
            </Button>
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={() => setTempoCisternBox(TempoCisternBoxes.GLOBAL)}
              sx={{
                backgroundColor: customTheme.palette.background.defaultBlue,
                color: customTheme.palette.background.defaultWhite,
              }}
            >
              {t("navigation.confirm")}
            </Button>
          </div>
        </div>
      ) : isTempoCisternOpen &&
        tempoCisternBox === TempoCisternBoxes.CISTERN_NAME ? (
        <div>
          <div
            style={{
              margin: "40px",
              padding: "4px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => closeFooter()}
              sx={{
                minWidth: "unset",
                position: "absolute",
                top: 20,
                right: 20,
                padding: 0,
                color: customTheme.palette.background.defaultBlue,
              }}
            >
              <Close
                backgroundColor={customTheme.palette.background.defaultBlue}
              />
            </Button>
            <Typography
              variant="h4"
              color={customTheme.palette.text.grey}
              style={{
                textWrap: "nowrap",
                padding: 20,
              }}
            >
              {t("common.mapPage.tempo_cistern.actual_coordonate")}
              <span
                style={{
                  color: customTheme.palette.background.defaultBlue,
                }}
              >
                {geolocation?.coords.accuracy}
              </span>
            </Typography>
            <div
              style={{
                width: "100%",
                display: "flex",

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => setTempoCisternBox(TempoCisternBoxes.INFOS)}
                sx={{
                  backgroundColor: customTheme.palette.background.defaultWhite,
                  color: customTheme.palette.background.red,
                  border: "solid 3px",
                  borderColor: customTheme.palette.background.red,
                }}
              >
                {t("navigation.cancel")}
              </Button>
              <Button
                variant="contained"
                size="large"
                color="success"
                onClick={() => setTempoCisternBox(TempoCisternBoxes.GLOBAL)}
                sx={{
                  backgroundColor: customTheme.palette.background.defaultBlue,
                  color: customTheme.palette.background.defaultWhite,
                }}
              >
                {t("navigation.confirm")}
              </Button>
            </div>
          </div>
        </div>
      ) : isTempoCisternOpen && tempoCisternBox === TempoCisternBoxes.GLOBAL ? (
        <div
          style={{
            margin: "40px",
            padding: "4px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            height: "inherit",
          }}
        >
          <div
            style={{
              minWidth: "unset",
              width: "100%",
              position: "absolute",
              top: 0,
              padding: "10px",
              color: customTheme.palette.background.defaultBlue,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TemporaryTank
              backgroundColor={customTheme.palette.background.lightWhite}
            />
            <Typography
              variant="h3"
              fontSize={18}
              color={customTheme.palette.background.lightWhite}
              textTransform={"initial"}
            >
              {t("common.mapPage.tempo_cistern.tempo_cistern")}
            </Typography>
          </div>
          <div
            style={{
              width: "100%",
            }}
          >
            <div style={{ margin: "30px 0" }}>
              <Typography
                variant="h4"
                color={customTheme.palette.background.greyLight}
                textTransform={"initial"}
                style={{
                  textAlign: lang === "ar" ? "right" : "left",
                }}
              >
                {t("common.mapPage.tempo_cistern.name")}
              </Typography>
              <span
                style={{
                  display: "flex",
                  flexDirection: lang === "ar" ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {isEditing ? (
                  <TextField
                    value={tempoCisternName}
                    onChange={(e) => setTempoCisternName(e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                    size="small"
                  />
                ) : (
                  <>
                    <Typography
                      variant="h3"
                      fontSize={20}
                      color={customTheme.palette.background.defaultBlue}
                      textTransform={"initial"}
                    >
                      {tempoCisternName}
                    </Typography>
                    <Button
                      variant="text"
                      onClick={handleEdit}
                      sx={{
                        background: "unset",
                        color: customTheme.palette.background.greyLight,
                        textTransform: "capitalize",
                        textDecoration: "underline",
                      }}
                    >
                      {t("navigation.modify")}
                    </Button>
                  </>
                )}
              </span>
            </div>

            <div>
              <Typography
                variant="h4"
                color={customTheme.palette.background.greyLight}
                textTransform={"initial"}
                style={{ textAlign: lang === "ar" ? "right" : "left" }}
              >
                {t("common.mapPage.tempo_cistern.coordinates")}
              </Typography>
              <span
                style={{
                  display: "flex",
                  flexDirection: lang === "ar" ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h3"
                  fontSize={20}
                  color={customTheme.palette.background.defaultBlue}
                  textTransform={"initial"}
                >
                  {geolocation?.coords.accuracy}
                </Typography>
                <Button
                  variant="text"
                  onClick={() => setTempoCisternBox(TempoCisternBoxes.INFOS)}
                  sx={{
                    background: "unset",
                    color: customTheme.palette.background.greyLight,
                    textTransform: "capitalize",
                    textDecoration: "underline",
                  }}
                >
                  {t("navigation.modify")}
                </Button>
              </span>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              size="medium"
              onClick={() => setTempoCisternBox(TempoCisternBoxes.INFOS)}
              sx={{
                backgroundColor: customTheme.palette.background.defaultWhite,
                color: customTheme.palette.background.red,
                border: "solid 3px",
                borderColor: customTheme.palette.background.red,
                mr: 3,
              }}
            >
              {t("navigation.cancel")}
            </Button>
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={() => geolocation && handleAddTempoCistern(geolocation)}
              sx={{
                backgroundColor: customTheme.palette.background.defaultBlue,
                color: customTheme.palette.background.defaultWhite,
                ml: 1,
              }}
            >
              {t("navigation.add")}
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "inline-flex",
            width: "inherit",
          }}
        >
          <Button
            variant="text"
            size="large"
            onClick={() => expandFooter(isFooterExpanded)}
            sx={{
              zIndex: "1010",
              height: 60,
              width: 60,
              p: 0,
              m: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Close
              backgroundColor={
                isFooterExpanded
                  ? customTheme.palette.background.greyLight
                  : customTheme.palette.background.blueDark
              }
              className={isFooterExpanded ? "unspinPlus" : "spinPlus"}
            />
          </Button>
          <div
            style={{
              display: "flex",
              width: isFooterExpanded ? "auto" : 0,
              justifyContent: "center",
              flex: 1,
              opacity: isFooterExpanded ? 1 : 0,
              transition: "0.2s opacity 0.2s",
              transitionTimingFunction: "step-start",
            }}
          >
            <Button
              variant="text"
              size="large"
              onClick={() => handleTempoCistern(true)}
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 0,
                m: 0,
              }}
            >
              <TemporaryTank
                backgroundColor={customTheme.palette.background.blueDark}
              />
              <Typography
                variant="h5"
                color={customTheme.palette.text.primary}
                textTransform={"initial"}
                style={{ textWrap: "nowrap" }}
              >
                {t("common.mapPage.tempo_cistern.tempo_cistern")}
              </Typography>
            </Button>
          </div>
        </div>
      )}

      <UseSnackBar
        isSnackOpen={isSnackOpen}
        setIsSnackOpen={setIsSnackOpen}
        snackMessage={snackMessage}
      />
    </FooterContainer>
  );
};

const FooterContainer = styled.div`
  .spinPlus {
    transform: rotateZ(135deg);
    transition: transform 500ms ease;
  }
  .unspinPlus {
    transition: transform 500ms ease;
  }
`;
export default Footer;
