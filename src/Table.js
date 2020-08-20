import React from "react";
import { sortData, formatNumber } from "./utils";
import "./Table.css";

const Table = ({ tableData, attribute }) => {
  const sortedData = sortData(tableData, attribute);
  return (
    <table className="table">
      <tbody>
        {sortedData.map(({ country, cases, deaths }) => {
          return (
            <tr key={country}>
              <td>{country}</td>
              <td>
                <strong>
                  {attribute === "cases"
                    ? formatNumber(cases, "0,0")
                    : formatNumber(deaths, "0,0")}
                </strong>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
