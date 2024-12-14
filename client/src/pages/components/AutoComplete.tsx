import { Autocomplete, Box, TextField } from "@mui/material";
import React from "react";
import { tankDataProps } from "../MapPage";
import { useMap } from "react-leaflet";
import SearchIcon from "@mui/icons-material/Search";

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
      sx={{ width: 300 }}
      renderInput={(params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            {...params}
            label="Tanks"
            id="input-with-sx"
            variant="standard"
          />
        </Box>
      )}
      style={{
        backgroundColor: "#fff",
        margin: "6px",
      }}
    />
  );
};

export default AutoComplete;
