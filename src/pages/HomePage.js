import React, { useState, useEffect } from "react";

import { ALL_COUNTRIES } from "./../config";
import Controls from "../components/Controls";
import List from "../components/List";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

const HomePage = ({ countries, setCountries }) => {
  const [filteredCountries, setFilteredCountries] = useState([]);

  const navigate = useNavigate();

  const handleSearch = (search, region) => {
    let data = [...countries];
    if (region) {
      data = data.filter((country) => country.region.includes(region));
    }
    if (search) {
      data = data.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredCountries(data);
  };

  const getCountries = async () => {
    const data = await fetch(ALL_COUNTRIES);
    const result = await data.json();
    setCountries(result);
    setFilteredCountries(result);
  };

  useEffect(() => {
    if (!countries.length) {
      getCountries();
    }
  }, []);

  return (
    <>
      <Controls onSearch={handleSearch} />
      <List>
        {filteredCountries.map((country) => (
          <Card
            img={country.flags.png}
            name={country.name.common}
            key={country.name.common}
            info={[
              { title: "Population", description: country.population },
              { title: "Region", description: country.region },
              { title: "Capital", description: country.capital[0] },
            ]}
            onClick={(e) => navigate("/country/" + country.name.common)}
          />
        ))}
      </List>
    </>
  );
};

export default HomePage;
