import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { tankDataProps } from "../MapPage";
import { useMap } from "react-leaflet";

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
    <div>
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
        renderInput={(params) => <TextField {...params} label="Tanks" />}
        style={{
          backgroundColor: "#fff",
          position: "fixed",
          zIndex: "10000",
          margin: "6px",
        }}
      />
    </div>
  );
};

export default AutoComplete;
