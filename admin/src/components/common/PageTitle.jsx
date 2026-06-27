import React from "react";
import { Helmet } from "react-helmet";

const PageTitle = ({ title, description }) => {
  return (
    <Helmet>
      <title>
        {" "}
        {title
          ? ` ${title} | Shivanya Fresh Masale Admin Dashboard`
          : "Shivanya Fresh Masale Admin Dashboard"}
      </title>
      <meta
        name="description"
        content={
          description
            ? ` ${description} `
            : "Shivanya Fresh Masale Admin Dashboard"
        }
      />
    </Helmet>
  );
};

export default PageTitle;
