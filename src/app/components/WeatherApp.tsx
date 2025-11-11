'use client';
import React, { useState } from 'react';
//

interface WeatherData {
  name: string;
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
}

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: WeatherData }
  | { status: 'error'; error: string };

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [state, setState] = useState<FetchState>({ status: 'idle' });

  const fetchWeather = async (q: string) => {
    if (!q) return;
    setState({ status: 'loading' });
    const key = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${key}&units=metric`
      );
      if (!res.ok) throw new Error('City not found');
      const data = (await res.json()) as WeatherData;
      setState({ status: 'success', data });
    } catch (err: any) {
      setState({ status: 'error', error: err.message || 'Unknown error' });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">WeatherScope</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchWeather(city);
        }}
        className="flex gap-2 mb-4"
      >
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 border rounded bg-blue-500 text-white">
          Search
        </button>
      </form>

      {state.status === 'idle' && <p className="text-center">Enter a city to get started.</p>}
      {state.status === 'loading' && <p className="text-center">Loading...</p>}
      {state.status === 'error' && (
        <p className="text-center text-red-600">Error: {state.error}</p>
      )}
      {state.status === 'success' && (
        <div className="mt-4 p-4 border rounded bg-white shadow">
          <h3 className="text-lg font-semibold">{state.data.name}</h3>
          <div className="flex items-center gap-4 mt-2">
            <img
              src={`https://openweathermap.org/img/wn/${state.data.weather[0].icon}@2x.png`}
              alt="icon"
            />
            <div>
              <p className="text-2xl">{Math.round(state.data.main.temp)}°C</p>
              <p className="capitalize">{state.data.weather[0].description}</p>
              <p>Humidity: {state.data.main.humidity}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
