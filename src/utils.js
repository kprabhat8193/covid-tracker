import React from "react";
import { Circle, Popup } from "react-leaflet";
import { Typography, Card } from "@material-ui/core";
import numeral from "numeral";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};

export const sortData = (data, attribute) => {
  return data.sort((a, b) => b[attribute] - a[attribute]);
};

export const showDataOnMap = (data, casesType = "cases") => {
  console.log("showDataOnMap >>>> ", data);
  return data.map((country) => (
    <Circle
      center={[country?.countryInfo?.lat, country?.countryInfo?.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <Card className="map__popupCard">
          <img src={country?.countryInfo?.flag} alt={country?.country} />
          <h2>{country?.country}</h2>
          <Typography color="textSecondary">
            Total Cases: {formatNumber(country?.cases, "0,0")}
          </Typography>
          <Typography color="textSecondary">
            Total Recovered: {formatNumber(country?.recovered, "0,0")}
          </Typography>
          <Typography color="textSecondary">
            Total Deaths: {formatNumber(country?.deaths, "0,0")}
          </Typography>
        </Card>
      </Popup>
    </Circle>
  ));
};

export const formatNumber = (number, format) => numeral(number).format(format);
