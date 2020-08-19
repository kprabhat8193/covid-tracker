import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Menu,
  Card,
  CardContent,
} from "@material-ui/core";

import "./App.css";
import InfoBox from "./InfoBox";
import Table from "./Table";
import LineGraph from "./LineGraph";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryData, setCountryData] = useState({});
  const [tableData, setTableData] = useState([]);

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
            cases={countryData?.todayCases}
            total={countryData?.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryData?.todayRecovered}
            total={countryData?.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryData?.todayDeaths}
            total={countryData?.deaths}
          />
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by Country</h3>
          <Table tableData={tableData} attribute={"cases"} />
          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
