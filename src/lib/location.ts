type Coordinates = {
  latitude: number;
  longitude: number;
};

export async function getUserLocation(): Promise<Coordinates | null> {
  if (!navigator.geolocation) {
    console.warn("Geolocation not supported by this browser.");
    return await fallbackToIPLocation();
  }

  const getCurrentPosition = (
    options?: PositionOptions
  ): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  try {
    const position = await getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 7000,
      maximumAge: 0,
    });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (highAccuracyError) {
    console.warn("High accuracy failed:", highAccuracyError);

    try {
      const position = await getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000,
      });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (lowAccuracyError) {
      console.error("Low accuracy also failed:", lowAccuracyError);
      return await fallbackToIPLocation();
    }
  }
}

async function fallbackToIPLocation(): Promise<Coordinates | null> {
  try {
    const res = await fetch("https://ipapi.co/json");
    if (!res.ok) {
      throw new Error("Failed to fetch IP location");
    }
    const data = await res.json();
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }
    return null;
  } catch (err) {
    console.error("IP-based fallback failed:", err);
    return null;
  }
}

export const getAddressFromCoords = async (lat?: number, lng?: number) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );
  const data = await res.json();
  return data.display_name; // e.g. "Victoria Island, Lagos, Nigeria"
};
