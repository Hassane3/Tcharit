import { Autocomplete, Box, TextField } from "@mui/material";
import React from "react";
import { tankDataProps } from "../MapPage";
import { useMap } from "react-leaflet";
import SearchIcon from "@mui/icons-material/Search";
import { customTheme } from "../../App";

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
      options={tanksData.map((tank: any) => tank.name)}
      sx={{
        width: 300,
        zIndex: "1000",
        margin: "6px",
        overflow: "hidden",
        borderRadius: "6px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
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
          <TextField
            {...params}
            label="Select cistern"
            id="input-with-sx"
            variant="filled"
            sx={{
              "& .MuiFormLabel-root": {
                color: customTheme.palette.text.grey,
              },
              "& .MuiSvgIcon-root": {
                color: customTheme.palette.background.defaultBlue,
              },
              "& .MuiInputBase-input": {
                color: customTheme.palette.text.secondary,
              },
            }}
          />
        </Box>
      )}
    />
  );
};

export default AutoComplete;
