import React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import "./InfoBox.css";
const InfoBox = ({
  title,
  cases,
  total,
  selected,
  selectedClassName,
  ...props
}) => {
  return (
    <div className={`infoBox ${selected && selectedClassName}`}>
      <Card className="infoBox__card" onClick={props.onClick}>
        <Typography color="textSecondary">{title}</Typography>
        <h2>{cases}</h2>
        <Typography color="textSecondary">
          {total}{" "}
          <span>
            <strong>Total</strong>
          </span>
        </Typography>
      </Card>
    </div>
  );
};

export default InfoBox;
