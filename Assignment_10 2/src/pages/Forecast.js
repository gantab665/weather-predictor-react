import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Forecast.css"; // Import your custom CSS file for styling

const API_KEY = "b109e7090dba936fd1c3d2f1ecd9cc51";
const places = [
    { name: "Hyderabad", id: "Hyderabad" },
    { name: "London", id: "London" },
    { name: "Boston", id: "Boston" },
    // Add more places as needed
];

function Forecast() {
    const [weatherData, setWeatherData] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(places[0].id); // Default location
    useEffect(() => {
        const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedLocation}&units=metric&appid=${API_KEY}`;

        axios
            .get(API_URL)
            .then((response) => {
                // Group the weather data by day
                const groupedData = groupDataByDay(response.data.list);
                setWeatherData(groupedData);
            })
            .catch((error) => {
                console.error("Error fetching weather data:", error);
            });
    }, [selectedLocation]);

    // Function to group data by day
    const groupDataByDay = (data) => {
        const groupedData = {};
        data.forEach((forecast) => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toDateString();
            if (!groupedData[day]) {
                groupedData[day] = forecast;
            }
        });
        return Object.values(groupedData);
    };

    // Function to calculate and format the dates
    const getFormattedDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    const formatdateForDetail = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add 1 because months are zero-indexed
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // Render weather data
    const renderWeatherData = () => {
        if (!weatherData) {
            return <p>Loading...</p>;
        }

        return (
            <div className="forecast container my-5">
                <h2 className="text-center mb-3 text-primary">5-Day Weather Forecast</h2>
                <div className="form-group">
                    <label htmlFor="locationSelect">Select Location:</label>
                    <select
                        id="locationSelect"
                        className="form-control"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)} // Handle location change
                    >
                        {places.map((place) => (
                            <option key={place.id} value={place.id}>
                                {place.name}
                            </option>
                        ))}
                    </select>
                </div>
                <p className="text-center text-muted mb-4">Select a day to view hourly details</p> {/* Informative subheading */}
                <div className="row">

                    {weatherData.map((forecast, index) => (
                        <Link
                            to={`/${selectedLocation}/${formatdateForDetail(forecast.dt)}`} // Send the location and date as parameters
                            key={index}
                            className="col-md-2 mb-4 day-link"
                        >
                            <div className="card">
                                <img
                                    src={`https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                                    alt={forecast.weather[0].description}
                                    className="card-img-top"
                                />
                                <div className="card-body">
                                    <h6>
                                        {getFormattedDate(forecast.dt)}
                                    </h6>
                                    <p className="card-text text-primary">
                                        High: {forecast.main.temp_max}&deg;C
                                    </p>
                                    <p className="card-text text-success">
                                        Low: {forecast.main.temp_min}&deg;C
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    return <div>{renderWeatherData()}</div>;
}

export default Forecast;
