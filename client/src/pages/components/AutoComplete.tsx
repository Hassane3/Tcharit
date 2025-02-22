import { Autocomplete, Box, IconButton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { tankDataProps } from "../MapPage";
import { useMap } from "react-leaflet";
import SearchIcon from "@mui/icons-material/Search";
import { customTheme } from "../../App";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

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

  return (
    <Autocomplete
      value={searchValue}
      onChange={(event: any, newValue: string) => {
        handleSetSearchValue(newValue);
        const tank = tanksData.find((tank) => tank.name === newValue);
        tank &&
          map.setView(tank.latLng, map.getZoom(), {
            animate: true,
          });
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        handleSetInputValue(newInputValue);
      }}
      id="controllable-states-demo"
      options={tankList.map((tank: any) => tank.name)}
      sx={{
        width: 300,
        zIndex: "1000",
        margin: "6px",
        overflow: "hidden",
        borderRadius: "6px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
      loading
      renderInput={(params) => (
        <Box
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
                  favorite
                </span>
              )}
            </IconButton>
          </div>
          <TextField
            {...params}
            label="Select cistern"
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
