import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';
import {
  WiCloud,
  WiDaySunny,
  WiRain,
  WiThunderstorm,
  WiSnow,
} from 'react-icons/wi';

const API_KEY = 'e99494dbcc32a3cd0f4010961b23a55f';

const Weather = () => {
  const [city, setCity] = useState('Tenkasi');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (query) => {
    const targetCity = query || city;
    if (!targetCity) return;

    setLoading(true);
    setError('');
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: targetCity,
            appid: API_KEY,
            units: 'metric',
          },
        }
      );
      setCurrentWeather(weatherRes.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            q: targetCity,
            appid: API_KEY,
            units: 'metric',
          },
        }
      );

      const daily = forecastRes.data.list.filter((item) =>
        item.dt_txt.includes('12:00:00')
      );
      setForecast(daily);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (main) => {
    switch (main) {
      case 'Clouds':
        return <WiCloud size={32} />;
      case 'Clear':
        return <WiDaySunny size={32} />;
      case 'Rain':
        return <WiRain size={32} />;
      case 'Thunderstorm':
        return <WiThunderstorm size={32} />;
      case 'Snow':
        return <WiSnow size={32} />;
      default:
        return <WiDaySunny size={32} />;
    }
  };

  useEffect(() => {
    fetchWeather('Tenkasi');
  }, []);

  return (
    <div className='weather-container'>
      <div className='search-input'>
        <input
          type='text'
          placeholder='Enter city'
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => fetchWeather()}>Search</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && currentWeather && (
        <>
          <h2>{currentWeather.name}</h2>
          <h1>{Math.round(currentWeather.main.temp)}&#176;C</h1>
          <div className='clouds'>
            <h5>{currentWeather.weather[0].main}</h5>
            <div className='humidity-container'>
              <div className='humidity'>
                <p>Humidity</p>
                <h5>{currentWeather.main.humidity}%</h5>
              </div>
              <div className='humidity'>
                <p>Wind Speed</p>
                <h5>{currentWeather.wind.speed} m/s</h5>
              </div>
            </div>
            <hr className='line' />
          </div>
        </>
      )}

      {!loading && forecast.length > 0 && (
        <div className='forecast'>
          <h3>5-Day Forecast</h3>
          <div className='days'>
            {forecast.map((day) => {
              const date = new Date(day.dt_txt);
              const weekday = date.toLocaleDateString('en-US', {
                weekday: 'short',
              });
              const temp = Math.round(day.main.temp);
              const condition = day.weather[0].main;

              return (
                <div className='day' key={day.dt}>
                  <h4>{weekday}</h4>
                  {getIcon(condition)}
                  <h4>{temp}&#176;C</h4>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
