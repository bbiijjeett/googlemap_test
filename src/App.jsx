import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const App = () => {
  const key = "AIzaSyCjmfQmCwj-979ON6348F86vUyhVGuXjNk"; // Replace with your Google Maps API key
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          reverseGeocode(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  const reverseGeocode = (lat, lng) => {
    // Reverse geocode the coordinates to get address details
    const base_url = "https://maps.googleapis.com/maps/api/geocode/json";
    const params = {
      latlng: `${lat},${lng}`,
      key: key,
    };

    axios
      .get(base_url, { params })
      .then((response) => {
        const data = response.data;
        if (response.status === 200 && data.status === "OK") {
          // Extract the address details
          const formattedAddress = data.results[0].formatted_address;
          setAddress(formattedAddress);
        } else {
          console.error("Error:", data.status);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDisplayAddress = () => {
    setDisplayAddress(address);
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: key,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded || loading) {
    return <div>Loading maps...</div>;
  }

  return (
    <div className="h-screen w-full p-5 flex justify-center items-center gap-5 bg-slate-900">
      <div className="h-[80vh] w-full md:w-1/2 flex flex-col justify-center items-center gap-5 bg-slate-200 p-10 rounded-2xl">
        <h1 className="text-3xl font-bold underline">Hello Google Map!</h1>
        {currentLocation && (
          <div className="h-full w-full bg-black">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={15}
              center={currentLocation}
            >
              <Marker position={currentLocation} />
            </GoogleMap>
          </div>
        )}
        <div className="flex flex-col justify-center items-center gap-5">
          <button
            onClick={handleDisplayAddress}
            className="px-5 py-5 bg-red-500 rounded-full font-semibold text-white"
          >
            Display Address
          </button>
          {displayAddress && (
            <p className="font-semibold text-center">
              Address: {displayAddress}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
