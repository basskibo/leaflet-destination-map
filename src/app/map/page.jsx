"use client"
import { useEffect, useRef, useState } from 'react';

const defaultCoordinates = [51.505, -0.09]; // Default center coordinates for the map
const coordinates = [
  { lat: 51.505, lng: -0.09, label: 'Location 1' },
  { lat: 51.515, lng: -0.1, label: 'Location 2' },
  { lat: 51.525, lng: -0.11, label: 'Location 3' },
];
const configuration = {
  mapOptions: {
    gm_layer: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  },
};

export default function MapPage() {
	const [mapInitialized, setMapInitialized] = useState(false);
	const userCentered = useRef(false); // Track whether the map was centered on the user's location
  
  useEffect(() => {
    // Check if the map already exists and reset if necessary
    const existingMap = L.DomUtil.get('map');
    if (existingMap && existingMap._leaflet_id != null) {
      existingMap._leaflet_id = null;
    }

    // Initialize the map
    const map = L.map('map').setView(defaultCoordinates, 13);

    // Add tile layer
    L.tileLayer(configuration.mapOptions.gm_layer, {
      maxZoom: 30,
      attribution: '',
    }).addTo(map);

    // Add markers to the map
    coordinates.forEach((location, index) => {
      const customIcon = L.divIcon({
        html: `<div style="background-color: #BB152C; color: white; border-radius: 50%; width: 30px; height: 30px;  text-align: center; line-height: 30px; font-weight: bolder; font-size: 20px">${index + 1}</div>`,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      L.marker([location.lat, location.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(location.label);
    });

    // Add routing control
    const waypoints = coordinates.map((location) =>
      L.latLng(location.lat, location.lng)
    );

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
      createMarker: function (i, wp) {
        return L.marker(wp.latLng, {
          icon: L.divIcon({
            html: `<div style="background-color: red; color: white; border-radius: 50%; width: 30px; height: 30px; text-align: center; line-height: 30px;">${i + 1}</div>`,
            className: 'custom-div-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          }),
        }).bindPopup(coordinates[i].label);
      },
      routeWhileDragging: false,
      draggableWaypoints: false,
      addWaypoints: false,
      show: false,
    }).addTo(map);

    // Add user's current location to the map (optional)
    if (!navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          const userMarker = L.marker([userLat, userLng]).addTo(map)
            .bindPopup('You are here!')
            .openPopup();

        //   map.setView([userLat, userLng], 13); // Adjust the zoom level if needed
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }

    // Cleanup function to remove the map when component unmounts
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }} />;
}
