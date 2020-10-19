import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./components/Infobox"
import LineGraph from "./components/LineGraph";
import Table from "./components/Table";
import { sortData, prettyPrintStat } from "./components/util";
import numeral from "numeral";
import Map from "./components/Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  console.log(casesType);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;







// import React,{useState,useEffect} from 'react';
// import {MenuItem,Select,FormControl,Card, CardContent} from "@material-ui/core"
// import './App.css';
// import Infobox from "./components/Infobox";
// import Map from "./components/Map";
// import Table from "./components/Table";
// import {sortData} from "./components/util";
// import LineGraph from "./components/LineGraph";
// import "leaflet/dist/leaflet.css";
// function App() {

//   const [countries,setCountries] = useState([]);

//   // we need to have something defaultly selected so we need another state

//   const [country,setCountry] = useState("WorldWide");

//   // for setting info of a perticular country

//   const [countryInfo,setCountryInfo] = useState({});

//   const [tableData,setTableData] = useState([]);

//   const [mapCenter,setMapCenter] = useState({lat:33.829205,lng:-84.377261});

//   const  [mapZoom,setMapZoom] = useState(3);

//   const [mapCountries,setMapCountries] = useState([])

//   useEffect(() => {

//     fetch("https://disease.sh/v3/covid-19/all")
//   .then(response => response.json())
//     .then(data => {
    
//       setCountryInfo(data);
//     });
//   },[]);

//   const onCountryChange = async (e) => {
//     const countrycode = e.target.value;
    
//     // setCountry(countrycode);

//     const url = countrycode === "WorldWide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countrycode}`;

//     await fetch(url)
//     .then(response => response.json())
//     .then(data => {
//       setCountry(countrycode);
//       setCountryInfo(data);
     
//       setMapCenter([data.countryInfo.lat, data.countryInfo.long])
//        setMapZoom(4);
//     });
//   };

  

//   useEffect(() => {

//     const getCountriesData = async () => {
//       await fetch("https://disease.sh/v3/covid-19/countries") 
//       .then((response) => response.json())
//        .then(data => {
//          const countries =data.map(country => (
//            {
//              name: country.country,
//              value: country.countryInfo.iso2
//            }));
            
//            const sortedData = sortData(data);
//            setTableData(sortedData)
//            setCountries(countries)
//            setMapCountries(data)
//           });
//        };   
//     getCountriesData();
//   },[]);

  
//   return (
//     <div className="app">
//         {/* header (title+the dropdown with all the countries) */}

//         <div className="app__left">
//          <div className="app__header">
//         <h1>COVID-19 TRACKER</h1>

//         <FormControl className="app__dropdown">
//           <Select
//           variant="outlined"
//           onChange={onCountryChange}
//           value={country} >
//            <MenuItem value="WorldWide">WorldWide</MenuItem>
//           {countries.map(country => (
//             <MenuItem value={country.value}>{country.name}</MenuItem>
//           ))}
          

//           </Select>
//         </FormControl>
//         </div>

//       {/* 3  boxes containing the death cases ,alive cases at that perticular ,movement */}
//       <div className="app__stats">
//         <Infobox title="Covid cases" cases={countryInfo.todayCases} total={countryInfo.cases}></Infobox>
//         <Infobox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></Infobox>
//         <Infobox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></Infobox>

//       </div>


//       {/* map  */}
//       <Map countries={mapCountries}
        
//           center={mapCenter}
//           zoom={mapZoom}>

//           </Map>

//       </div>

//       <Card className="app__right">

//       {/* on the right side */}
        
//       <CardContent>

//       {/* a table (countries with total number of death cases) */}
//        <h3>Live cases by Country</h3> 
//          <Table countries={tableData} />


//          <h3>World wide new Cases</h3>
//          <LineGraph>
//        {/* graph (showing the rate)  */}
//        </LineGraph>
       
//       </CardContent>
        
//      </Card>
 
//     </div>
//   );
// }

// export default App;