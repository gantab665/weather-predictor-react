import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_KEY = "b109e7090dba936fd1c3d2f1ecd9cc51"; // Replace with your OpenWeatherMap API key

function DayDetail() {
    const { location, date } = useParams(); // Get location and date from route parameters
    const [hourlyData, setHourlyData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch hourly forecast data for the selected location and date
        const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`;

        axios
            .get(API_URL)
            .then((response) => {
                // Filter hourly data for the selected date
                const filteredData = response.data.list.filter((forecast) => {
                    const forecastDate = forecast.dt_txt.split(" ")[0];
                    return forecastDate === date;
                });
                setHourlyData(filteredData);
            })
            .catch((error) => {
                console.error("Error fetching hourly weather data:", error);
            });
    }, [location, date]);

    // Function to format time from timestamp
    const getFormattedTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const options = { hour: "2-digit", minute: "2-digit" };
        return date.toLocaleTimeString("en-US", options);
    };

    const handleReturnToForecast = () => {
        navigate("/"); // Redirect to the Forecast page ("/")
    };

    // Render hourly weather data
    const renderHourlyData = () => {
        if (!hourlyData) {
            return <p>Loading...</p>;
        }

        return (
            <div className="container my-5">
                <h2 className="text-center mt-3">Hourly Weather Forecast for {date} -- { location}</h2>
                <p className="text-center mb-4">
                    Click on a day to return to the 5-day forecast{" "}
                    <a
                        className="btn btn-link"
                        onClick={handleReturnToForecast}
                    >
                        Return to 5-Day Forecast
                    </a>
                </p>
                <div className="row">
                    {hourlyData.map((forecast, index) => (
                        <div
                            key={index}
                            className="col-md-2 mb-4"
                        >
                            <div className="card">
                                <img
                                    src={`https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                                    alt={forecast.weather[0].description}
                                    className="card-img-top"
                                />
                                <div className="card-body">
                                    <h6>
                                        {getFormattedTime(forecast.dt)}
                                    </h6>
                                    <p className="card-text text-primary">
                                        Temperature: {forecast.main.temp}&deg;C
                                    </p>
                                    <p className="card-text text-success">
                                        Description: {forecast.weather[0].description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            {renderHourlyData()}
        </div>
    );
}

export default DayDetail;
