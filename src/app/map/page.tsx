// src/app/map/page.tsx
"use client"
import React, { useEffect } from 'react';
import Head from 'next/head';

const MapPage = () => {
	useEffect(() => {
		// Initialize the map after the component mounts
		const map = L.map('map').setView([45.2514, 19.8708], 13);
		L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
			maxZoom: 30,
			attribution: ''
		}).addTo(map);

		const locations = [
			{ label: "Petrovaradin Fortress", lat: 45.2514, lng: 19.8708 },
			{ label: "The Name of Mary Church", lat: 45.2552, lng: 19.8426 },
			{ label: "Dunavska Street", lat: 45.2574, lng: 19.8433 },
			{ label: "Danube Park", lat: 45.26, lng: 19.8455 }
		];

		locations.forEach((location, index) => {
			const customIcon = L.divIcon({
				html: `<div style="background-color: #BB152C; color: white; border-radius: 50%; width: 30px; height: 30px; text-align: center; line-height: 30px; font-weight: bolder; font-size: 20px">${index + 1}</div>`,
				className: 'custom-div-icon',
				iconSize: [30, 30],
				iconAnchor: [15, 30]
			});
			L.marker([location.lat, location.lng], { icon: customIcon }).addTo(map).bindPopup(location.label);
		});

		const waypoints = locations.map(location => L.latLng(location.lat, location.lng));
		const routingControl = L.Routing.control({
			waypoints: waypoints,
			router: L.Routing.osrmv1({
				serviceUrl: 'https://router.project-osrm.org/route/v1'
			}),
			createMarker: function (i, wp, nWps) {
				return L.marker(wp.latLng, {
					icon: L.divIcon({
						html: `<div style="background-color: red; color: white; border-radius: 50%; width: 30px; height: 30px; text-align: center; line-height: 30px;">${i + 1}</div>`,
						className: 'custom-div-icon',
						iconSize: [30, 30],
						iconAnchor: [15, 30]
					})
				}).bindPopup(locations[i].label);
			},
			routeWhileDragging: false,
			draggableWaypoints: false,
			addWaypoints: false,
			show: false
		}).addTo(map);

		// User location functionality can be added here
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(
				(position) => {
					const userLat = position.coords.latitude;
					const userLng = position.coords.longitude;
					const accuracy = position.coords.accuracy;
					// Add a marker for the user's current location
				userMarker = L.marker([userLat, userLng], {
							icon: L.divIcon({
								html: '<div style="background-color: blue; color: white; border-radius: 50%; width: 30px; height: 30px; text-align: center; line-height: 30px;">You</div>',
								className: 'custom-div-icon',
								iconSize: [30, 30],
								iconAnchor: [15, 30]
							})
						}).addTo(map)
						.bindPopup('You are here with ' + accuracy + ' meters accuracy.')
						.openPopup();

					// Optionally center the map on the user's location
					// map.setView([userLat, userLng], 20);  // Adjust the zoom level as needed
				},
				(error) => {
					console.error('Error getting location:', error);
					 switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.");
                    break;
            }
				},
				{
					enableHighAccuracy: true,   // Higher accuracy for location tracking
					timeout: 10000,            // Timeout of 10 seconds for location
					maximumAge: 0              // Don't accept cached positions
				}
			);
		} else {
			console.log('Geolocation is not supported by this browser.');
		}
		return () => {
			map.remove(); // Clean up on unmount
		};
	}, []);

	return (
		<>
			<Head>
				<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
				<script src="https://unpkg.com/leaflet/dist/leaflet.js" async />
				<script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js" async />
			</Head>
			<div id="map" style={{ height: '100vh', width: '100%' }}></div>
		</>
	);
};

export default MapPage;
