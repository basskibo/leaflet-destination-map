"use client";
import { useEffect, useRef, useState } from 'react';
import styles from './MapPage.module.css';

const defaultCoordinates = [45.2514, 19.8708];
const coordinates = [
	{ label: "Kej", lat: 45.252869724193786, lng: 19.856360549467105 },
	{ label: "Petrovaradin Fortress", lat: 45.2514, lng: 19.8708 },
	{ label: "The Cathedral", lat: 45.2552, lng: 19.8426 },
	// { label: "Dunavska Street", lat: 45.2574, lng: 19.8433 },
	{ label: "Danube Park", lat: 45.255300574496346, lng: 19.85088770730801 },
	{ label: "Z stanica", lat: 45.2653657676428, lng: 19.830854301049 },
	{ label: "Novi Park", lat: 45.25605768553349, lng: 19.80846 },
	{ label: "Novi Park", lat: 44.80727116507866,  lng: 20.474817604895193 },
	
];

const mapConfig = {
	mapOptions: {
		os_layer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		gm_layer: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
		sat: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		osmb: 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
	},
};


const locateOptions = {
	setView: 'untilPanOrZoom',
	flyTo: true
}

export default function MapPage() {
	const [mapInitialized, setMapInitialized] = useState(false);
	const userCentered = useRef(false);
	const userMarkerRef = useRef(null);
	const routingControlRef = useRef(null);
	let updatedInitialView = false;

	useEffect(() => {
		const existingMap = L.DomUtil.get('map');
		if (existingMap && existingMap._leaflet_id != null) {
			existingMap._leaflet_id = null;
		}
		console.log('useEffect:: updating the view ')
		const map = L.map('map').setView([coordinates[0].lat, coordinates[0].lng], 13);


		// L.tileLayer(mapConfig.mapOptions.gm_layer, {
		// 	maxZoom: 20,
		// 	minZoom: 0,
		// 	attribution: '',
		// }).addTo(map);
		L.control.locate().addTo(map);

		coordinates.forEach((location, index) => {
			const customIcon = L.divIcon({
				html: `<div style="background-color: #7B0F0F; border: '5px solid #000'; color: white; border-radius: 50%; width: 30px; height: 30px; text-align: center; line-height: 30px; font-weight: bolder; font-size: 20px">${index + 1}</div>`,
				className: 'custom-div-icon',
				iconSize: [30, 30],
				iconAnchor: [15, 30],
			});

			L.marker([location.lat, location.lng], { icon: customIcon })
				.addTo(map)
				.bindPopup(location.label);
		});

		const waypoints = coordinates.map((location) =>
			L.latLng(location.lat, location.lng)
		);

		L.Routing.control({
			waypoints: waypoints,
			router: L.Routing.osrmv1({
				serviceUrl: 'https://router.project-osrm.org/route/v1',
			}),
			lineOptions: {
				styles: [{ color: '#B61010', opacity:1 , weight: 5 }],
			},
			createMarker: (i, wp) => {
				return L.marker(wp.latLng, {
					icon: L.divIcon({
						html: `<div style="background-color: #B61010; color: white; border-radius: 5%; width:100%; height: 30px; font-weight: bolder; text-align:  center; line-height: 30px;">${coordinates[i].label}</div>`,
						className: 'custom-div-icon',
						iconSize: [120, 50],
						iconAnchor: [15, 30],
					}),
				}).bindPopup(coordinates[i].label);
			},
			routeWhileDragging: false,
			draggableWaypoints: false,
			addWaypoints: false,
			show: false,
		}).addTo(map);

		removeRoutingTable();

		// if (navigator.geolocation) {
		// 	let routeUpdateTimer;
		// 	navigator.geolocation.watchPosition(
		// 		(position) => {
		// 			const userLat = position.coords.latitude;
		// 			const userLng = position.coords.longitude;

		// 			if (!updatedInitialView) {
		// 				const userIcon = L.divIcon({
		// 					html: `<div style="background-color: #4285F4; border-radius: 50%; width: 15px; height: 15px; border: 10px solid #a7c3f2;"></div>`,
		// 					className: 'user-location-icon',
		// 					iconSize: [15, 15],
		// 					iconAnchor: [7.5, 7.5],
		// 				});

		// 				userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
		// 				console.log('On user location change >>>')
		// 				// map.setView([userLat, userLng], 13);

		// 				routingControlRef.current = L.Routing.control({
		// 					waypoints: [
		// 						L.latLng(userLat, userLng),
		// 						L.latLng(coordinates[0].lat, coordinates[0].lng),
		// 					],
		// 					router: L.Routing.osrmv1({
		// 						serviceUrl: 'https://router.project-osrm.org/route/v1',
		// 					}),
		// 					createMarker: () => null,
		// 					lineOptions: {
		// 						styles: [{ color: 'blue', opacity: 0.8, weight: 4, dashArray: '5, 10' }],
		// 					},
		// 					routeWhileDragging: false,
		// 					draggableWaypoints: false,
		// 					addWaypoints: false,
		// 					show: false,
		// 				}).addTo(map);
		// 				removeRoutingTable();
		// 				updatedInitialView = true;
		// 			} else {
		// 				userMarkerRef.current.setLatLng([userLat, userLng]);

		// 				if (!routeUpdateTimer) {
		// 					routeUpdateTimer = setTimeout(() => {
		// 						routingControlRef.current.setWaypoints([
		// 							L.latLng(userLat, userLng),
		// 							L.latLng(coordinates[0].lat, coordinates[0].lng),
		// 						]);
		// 						routeUpdateTimer = null;
		// 					}, 1500);
		// 				}
		// 			}
		// 		},
		// 		(error) => console.error('Error getting location:', error),
		// 		{
		// 			maximumAge: 3000,
		// 			timeout: 5000,
		// 			enableHighAccuracy: true,
		// 		}
		// 	);
		// } else {
		// 	console.log('Geolocation is not supported by this browser.');
		// }


		const openStreetMapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
		}).addTo(map);

		const baseMapsLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
		});

		const stadiamapsLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
		});
		
		const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
		});

		const baseLayers = {
			'OpenStreetMap': openStreetMapLayer,
			'Base Map': baseMapsLayer,
			'Stadia': stadiamapsLayer,
			"Sattelite": satelliteLayer
		};

		L.control.layers(baseLayers).addTo(map);
		return () => map && map.remove();
	}, []);

	const removeRoutingTable = () => {
		const routingContainers = document.querySelectorAll('.leaflet-routing-container');
		routingContainers.forEach(container => {
			container.style.display = 'none';
		});
	};

	return (
		<div>
			<style jsx>{`
				.leaflet-routing-container {
					display: none !important;
				}
			`}</style>
			<div
				style={{
					width: '100%',
					paddingLeft: '1rem',
					background: '#cecece',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'start',
					alignItems: 'center',
					gap: '2rem',
					borderBottom: '2px solid #fed142',
					height: '3rem',
				}}
			>
				<a
					style={{
						color: '#010101',
						fontWeight: 'bolder',
						fontSize: '1.2rem',
						textDecoration: 'none',
					}}
					href="/"
				>
					Map
				</a>
				<a
					style={{
						color: '#010101',
						fontWeight: 'bolder',
						fontSize: '1.2rem',
						textDecoration: 'none',
					}}
					href="/map"
				>
					Routing map
				</a>
			</div>
			<div id="map" style={{ height: '100vh', width: '100%' }} />
		</div>
	);
}
