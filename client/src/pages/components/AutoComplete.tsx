import { Autocomplete, Box, IconButton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { tankDataProps } from "../MapPage";
// import { useMap } from "react-leaflet";
import SearchIcon from "@mui/icons-material/Search";
import { customTheme } from "../../App";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useTranslation } from "react-i18next";
import { useMap } from "@vis.gl/react-google-maps";

interface AutoCompleteProps {
  tanksData: Array<tankDataProps>;
  searchValue: string | null;
  inputValue: string;
  handleSetSearchValue: (searchValue: string | null) => void;
  handleSetInputValue: (inputSearchValue: string) => void;
}

const AutoComplete = (props: AutoCompleteProps) => {
  const {
    tanksData,
    searchValue,
    inputValue,
    handleSetSearchValue,
    handleSetInputValue,
  } = props;

  const map = useMap();
  const { t } = useTranslation();
  const [isCheckedFavorites, setIsCheckedFavorites] = useState<boolean>(false);
  const [tankList, setTankList] = useState<Array<tankDataProps>>([]);
  const [isFavLabelActive, setIsFavLabelActive] = useState<boolean>(false);

  useEffect(() => {
    // transform localStorage value to array of number values
    let favTanks = localStorage.getItem("favorites")?.split(",").map(Number);
    if (!isCheckedFavorites) {
      setTankList(tanksData);
    } else {
      setTankList(tanksData.filter((tank) => favTanks?.includes(tank.id)));
    }
  }, [isCheckedFavorites, tanksData]);

  // // Disable map interaction when Autocomplete is focused
  // const handleFocus = () => {
  //   if (map) {
  //     map.dragging.disable();
  //     map.scrollWheelZoom.disable();
  //   }
  // };

  // // Enable map interaction when clicking outside Autocomplete
  // const handleBlur = () => {
  //   if (map) {
  //     map.dragging.enable();
  //     map.scrollWheelZoom.enable();
  //   }
  // };

  const lang = localStorage.getItem("language");
  return (
    <Autocomplete
      value={searchValue}
      // onFocus={handleFocus}
      // onBlur={handleBlur}
      onChange={(event: any, newValue: string) => {
        handleSetSearchValue(newValue);
        const tank = tanksData.find(
          (tank) =>
            (lang === "ar" ? tank.arab_name : tank.latin_name) === newValue
        );

        tank &&
          map?.setCenter(
            // "-0.0002" to avoid having the marker hidden by the keyboard (on mobile)
            { lat: tank.latLng.lat - 0.0002, lng: tank.latLng.lng }
          );
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        handleSetInputValue(newInputValue);
      }}
      id="controllable-states-demo"
      options={tankList.map((tank: any) =>
        lang === "ar" ? tank.arab_name : tank.latin_name
      )}
      sx={{
        width: 300,
        zIndex: "1000",
        margin: "6px",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
      loading
      renderInput={(params) => (
        <Box
          onClick={(e) => e.preventDefault()}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: customTheme.palette.background.defaultWhite,
          }}
        >
          <SearchIcon
            sx={{
              color: customTheme.palette.background.defaultBlue,
              m: "0 6px",
            }}
          />
          <div style={{ borderLeft: "solid #d9d9d9 1px" }}>
            <IconButton
              className="facInavtive"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsCheckedFavorites(!isCheckedFavorites);
                // Display favorite label for one s
                setIsFavLabelActive(true);
                setTimeout(() => {
                  setIsFavLabelActive(false);
                }, 1000);
              }}
              sx={{
                ".favActive :active ": {
                  ":after": {
                    content: "'favoris'",
                    display: "block",
                    position: "absolute",
                    zIndex: "20",
                    top: "10px",
                    left: "10px",
                    width: "100px",
                    height: "100px",
                    border: "solid blue 2px",
                  },
                },
              }}
            >
              {isCheckedFavorites ? (
                <StarRoundedIcon
                  sx={{
                    color: customTheme.palette.background.blue,
                  }}
                />
              ) : (
                <StarOutlineRoundedIcon
                  style={{ color: customTheme.palette.background.lightWhite }}
                />
              )}
              {isFavLabelActive && (
                <span
                  style={{
                    position: "absolute",
                    fontSize: "14px",
                    zIndex: "20",
                    backgroundColor: customTheme.palette.background.lightWhite,
                    color: customTheme.palette.background.defaultBlue,
                    padding: "2px 14px",
                    borderRadius: "10px",
                    opacity: 0.8,
                    transition: "ease-in 1s",
                    bottom: "-10%",
                  }}
                >
                  {t("common.tank.favorite")}
                </span>
              )}
            </IconButton>
          </div>
          <TextField
            {...params}
            label={t("common.tank.select_cistern")}
            id="input-with-sx"
            variant="filled"
            sx={{
              "& .MuiFilledInput-root ": {
                backgroundColor: customTheme.palette.background.defaultWhite,
              },
              "& .MuiFormLabel-root": {
                color: customTheme.palette.text.grey,
              },
              "& .MuiSvgIcon-root": {
                color: customTheme.palette.background.defaultBlue,
              },
              "& .MuiInputBase-input": {
                color: customTheme.palette.text.primary,
              },
            }}
          />
        </Box>
      )}
    />
  );
};

export default AutoComplete;
