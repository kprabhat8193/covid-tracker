import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Menu,
  Card,
  CardContent,
} from "@material-ui/core";
import "leaflet/dist/leaflet.css";

import "./App.css";
import InfoBox from "./InfoBox";
import Table from "./Table";
import LineGraph from "./LineGraph";
import Map from "./Map";
import { formatNumber } from "./utils";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryData, setCountryData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.768508,
    lng: -98.554363,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryData(data);
      });
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          setTableData(data);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountries();
  }, []);

  const countryChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?strict=true`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryData(data);
        setCountry(countryCode);
        if (countryCode === "worldwide") {
          setMapCenter({ lat: 37.768508, lng: -98.554363 });
          setMapZoom(3);
        } else {
          // There's a bug in Leaflet where it's not loading the correct map center
          // setMapCenter({ lat: 37.768508, lng: -98.554363 });
          setMapCenter([data?.countryInfo?.lat, data?.countryInfo?.long]);
          setMapZoom(4);
        }
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={countryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(({ name, value }) => (
                <MenuItem value={value} key={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            title="Coronavirus cases"
            cases={formatNumber(countryData?.todayCases, "0.0a")}
            total={formatNumber(countryData?.cases, "0.0a")}
            onClick={(e) => setCasesType("cases")}
            selected={casesType === "cases"}
            selectedClassName="infoBox--selected"
          />
          <InfoBox
            title="Recovered"
            cases={formatNumber(countryData?.todayRecovered, "0.0a")}
            total={formatNumber(countryData?.recovered, "0.0a")}
            onClick={(e) => setCasesType("recovered")}
            selected={casesType === "recovered"}
            selectedClassName="infoBox--selectedGreen"
          />
          <InfoBox
            title="Deaths"
            cases={formatNumber(countryData?.todayDeaths, "0.0a")}
            total={formatNumber(countryData?.deaths, "0.0a")}
            onClick={(e) => setCasesType("deaths")}
            selected={casesType === "deaths"}
            selectedClassName="infoBox--selected"
          />
        </div>
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by Country</h3>
          <Table tableData={tableData} attribute={"cases"} />
          <h3>Worldwide new cases</h3>
          <div className="app__lineGraphContainer">
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
