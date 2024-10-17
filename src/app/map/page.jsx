"use client";
import { useEffect, useRef, useState } from 'react';
import styles from './MapPage.module.css';

const defaultCoordinates = [45.2552, 119.8426]; // Default center coordinates for the map
const coordinates = [
	{ "label": "Petrovaradin Fortress", "lat": 45.2514, "lng": 19.8708 },
	{ "label": "The Name of Mary Church", "lat": 45.2552, "lng": 19.8426 },
	{ "label": "Dunavska Street", "lat": 45.2574, "lng": 19.8433 },
	{ "label": "Danube Park", "lat": 45.26, "lng": 19.8455 },
	{ "label": "Z stanica", "lat": 45.2653657676428, "lng": 19.830854301049 }
];

const configuration = {
	mapOptions: {
		gm_layer: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
	},
};

export default function MapPage() {
	console.log('Map page loaded >>>> ', new Date())
	const [mapInitialized, setMapInitialized] = useState(false);
	const userCentered = useRef(false); // Track whether the map was centered on the user's location
	const userMarkerRef = useRef(null); // Reference to the user's marker to update its position
	let updatedInitialView = false;

	useEffect(() => {
		console.log('use effect called ', new Date())
		// Check if the map already exists and reset if necessary
		const existingMap = L.DomUtil.get('map');
		if (existingMap && existingMap._leaflet_id != null) {
			existingMap._leaflet_id = null;
		}

		const map = L.map('map').setView(defaultCoordinates, 13);

		L.tileLayer(configuration.mapOptions.gm_layer, {
			maxZoom: 30,
			attribution: '',
		}).addTo(map);

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

		L.Routing.control({
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

		// const routingContainer = document.querySelector('.leaflet-routing-container');
		// if (routingContainer) {
		// 	routingContainer.style.display = 'none';
		// }

		// Add user's current location to the map (optional)
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(
				(position) => {
					const userLat = position.coords.latitude;
					const userLng = position.coords.longitude;

					if (!updatedInitialView) {
						// Create a custom user marker (Google Maps-like blue dot)
						const userIcon = L.divIcon({
							html: `<div style="background-color: #4285F4; border-radius: 50%; width: 15px; height: 15px; border: 10px solid #a7c3f2;"></div>`,
							className: 'user-location-icon',
							iconSize: [15, 15],
							iconAnchor: [7.5, 7.5],
						});

						userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
				
						map.setView([userLat, userLng], 15); // Adjust the zoom level if needed
						L.Routing.control({
							waypoints: [
								L.latLng(userLat, userLng),
								L.latLng(coordinates[0].lat, coordinates[0].lng)
							],
							router: L.Routing.osrmv1({
								serviceUrl: 'https://router.project-osrm.org/route/v1',
							}),
							createMarker: function (i, wp) {
								return L.marker(wp.latLng, {
									icon: L.divIcon({
										html: `<div style="display: none; background-color: red; color: white; border-radius: 50%; width: 30px; height: 30px; text-align: center; line-height: 30px;">${i + 1}</div>`,
										className: 'custom-div-icon',
										iconSize: [0, 0],
										iconAnchor: [0, 0],
									}),
								});
							},
							lineOptions: {
								styles: [{ color: 'blue', opacity: 0.8, weight: 4, dashArray: '5, 10' }], 
							},
							routeWhileDragging: false,
							draggableWaypoints: false,
							addWaypoints: false,
							show: false,
						


						}).addTo(map);
					
						updatedInitialView = true;
					} else {
						// Update the position of the existing user marker
						userMarkerRef.current.setLatLng([userLat, userLng]);
					}
					const routingContainers = document.querySelectorAll('.leaflet-routing-container');
					console.log('found containers >> ', routingContainers);
					if (routingContainers.length > 0) {
						console.log('removing all sidebars >>>>>');
						routingContainers.forEach(container => {
							container.style.display = 'none';
						});
					}
				
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

	
	return <div>
		<style jsx>{`
      .leaflet-routing-container {
        display: none !important;
      }
    `}</style>
		<div style={{
			width: '100%', paddingLeft: '1rem', background: '#cecece', display: 'flex',
			flexDirection: 'row', justifyContent: 'start', alignItems: 'center', gap: '2rem',
			borderBottom: '2px solid #fed142', height: '3rem'
		}}>
			<a style={{
				color: '#010101', fontWeight: 'bolder',
				fontSize: '1.2rem', textDecoration: 'none'
			}} href="/">
				Map
			</a>
			<a style={{
				color: '#010101', fontWeight: 'bolder',
				fontSize: '1.2rem', textDecoration: 'none'
			}} href="/map">
				Routing map
			</a>
		</div>
		<div id="map" style={{ height: '100vh', width: '100%' }} />
	</div>;
}
