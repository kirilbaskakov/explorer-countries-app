import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import styled from "styled-components";
import { filterByCode, searchByCountry } from "../config";
import Container from "../components/Container";

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  cursor: pointer;
  font-size: var(--fs-sm);
  border: none;
  border-radius: var(--radii);
  background-color: var(--colors-ui-base);
  color: var(--colors-text);
  box-shadow: var(--shadow);
  padding: 0.75rem 1rem;
`;

const Wrapper = styled.div`
  margin-top: 2rem;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 767px) {
    flex-direction: row;
    align-items: center;
    gap: 4rem;
  }
`;

const Image = styled.img`
  display: flex;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Title = styled.h1`
  margin: 0;

  font-weight: var(--fw-normal);
`;

const ListGroup = styled.div`
  margin-top: 2rem;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 4rem;
  }
`;

const InfoList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const InfoListItem = styled.li`
  line-height: 1.8;

  & > b {
    font-weight: var(--fw-bold);
  }
`;

const Meta = styled.div`
  margin-top: 2rem;

  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  align-items: flex-start;

  & > b {
    font-weight: var(--fw-bold);
  }

  @media (min-width: 767px) {
    flex-direction: row;
    align-items: center;
  }
`;

const TagGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Tag = styled(Link)`
  color: var(--colors-text);
  text-decoration: none;
  padding: 0 1rem;
  background-color: var(--colors-ui-base);
  box-shadow: var(--shadow);
  line-height: 1.5;
  cursor: pointer;
`;

const Details = ({}) => {
  const { name } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [infoLists, setInfoLists] = useState([]);
  const [borders, setBorders] = useState([]);
  const [neighbors, setNeighbors] = useState([]);

  const getCountry = async () => {
    const data = await fetch(searchByCountry(name));
    const country = (await data.json())[0];
    setImage(country?.flags?.png);

    setInfoLists([
      [
        { title: "Population", description: country.population },
        { title: "Region", description: country.region },
        { title: "Sub Region", description: country.subregion },
        { title: "Capital", description: country.capital[0] },
      ],
      [
        {
          title: "Top Level Domain",
          description: country.tld?.join(", ") || "",
        },
        {
          title: "Currencies",
          description:
            Object.values(country.currencies)
              .map((el) => el.name)
              ?.join(", ") || "",
        },
        {
          title: "Languages",
          description: Object.values(country.languages)?.join(", ") || "",
        },
      ],
    ]);

    setBorders(country.borders);
  };

  const getNeighbors = async () => {
    if (borders?.length) {
      const data = await fetch(filterByCode(borders));
      const countries = await data.json();
      setNeighbors(countries.map((country) => country.name.common));
    }
  };

  useEffect(() => {
    getCountry();
  }, [name]);

  useEffect(() => {
    getNeighbors();
  }, [borders]);

  return (
    <div>
      <Button onClick={() => navigate(-1)}>
        <IoArrowBack /> Back
      </Button>
      <Wrapper>
        <Image src={image} alt={name} />
        <Container>
          <Title>{name}</Title>
          <ListGroup>
            {infoLists.map((infoList) => (
              <InfoList>
                {infoList.map((info) => (
                  <InfoListItem>
                    <b>{info.title}:</b> {info.description}
                  </InfoListItem>
                ))}
              </InfoList>
            ))}
          </ListGroup>
          <Meta>
            <b>Border countries: </b>
            {neighbors?.length ? (
              <TagGroup>
                {neighbors.map((neighbor) => (
                  <Tag key={neighbor} to={`/country/${neighbor}`}>
                    {neighbor}
                  </Tag>
                ))}
              </TagGroup>
            ) : (
              <span>There is no border countries</span>
            )}
          </Meta>
        </Container>
      </Wrapper>
    </div>
  );
};

export default Details;
