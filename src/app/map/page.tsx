"use client";
import { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
import 'leaflet.locatecontrol';
import 'leaflet-routing-machine';

interface Coordinate {
	label: string;
	lat: number;
	lng: number;
}

interface MapConfig {
	mapOptions: {
		os_layer: string;
		gm_layer: string;
		sat: string;
		osmb: string;
	};
}

interface LocateOptions {
	setView: string;
	flyTo: boolean;
}

const defaultCoordinates: [number, number] = [45.2514, 19.8708];
const coordinates: Coordinate[] = [
	{ label: "Kej", lat: 45.252869724193786, lng: 19.856360549467105 },
	{ label: "Petrovaradin Fortress", lat: 45.2514, lng: 19.8708 },
	{ label: "The Cathedral", lat: 45.2552, lng: 19.8426 },
	{ label: "Danube Park", lat: 45.255300574496346, lng: 19.85088770730801 },
	{ label: "Novi Park", lat: 45.25605768553349, lng: 19.80846 },
    { label: "Suboticka", lat: 45.242686 , lng: 19.81603 },
    { label: "Limanski park", lat: 45.23813827085418, lng:19.8398908809267 },

];

const mapConfig: MapConfig = {
	mapOptions: {
		os_layer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		gm_layer: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
		sat: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		osmb: 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
	},
};

const locateOptions: LocateOptions = {
	setView: 'untilPanOrZoom',
	flyTo: true
};

export default function MapPage() {
	const stadiaApiKey: string | undefined = process.env.NEXT_PUBLIC_STADIA_API_KEY;
	console.log('KLEY ', stadiaApiKey);
	const [mapInitialized, setMapInitialized] = useState<boolean>(false);
	const userCentered = useRef<boolean>(false);
	const userMarkerRef = useRef<L.Marker | null>(null);
	const routingControlRef = useRef<L.Routing.RoutingControl | null>(null);
	let updatedInitialView = false;

	useEffect(() => {
		const existingMap = L.DomUtil.get('map') as HTMLElement | null;
		if (existingMap && (existingMap as any)._leaflet_id != null) {
			(existingMap as any)._leaflet_id = null;
		}
		console.log('useEffect:: updating the view ');
		const map = L.map('map').setView([coordinates[0].lat, coordinates[0].lng], 15);

		// L.tileLayer(mapConfig.mapOptions.gm_layer, {
		// 	maxZoom: 20,
		// 	minZoom: 0,
		// 	attribution: '',
		// }).addTo(map);
		const locateControl = L.control.locate();
		locateControl.addTo(map);

		coordinates.forEach((location, index) => {
			const customIcon = L.divIcon({
				html: `<div style="background-color:rgb(148, 68, 68); border: '5px solid #000'; color: white; border-radius: 50%; width: 30px; height: 30px; text-align: center; line-height: 30px; font-weight: bolder; font-size: 20px">${index + 1}</div>`,
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

		const routingControl = L.Routing.control({
			waypoints: waypoints,
			router: L.Routing.osrmv1({
				serviceUrl: 'https://router.project-osrm.org/route/v1',
			}),
			lineOptions: {
				styles: [{ color: '#B61010', opacity: 1, weight: 5 }],
			},
			createMarker: (i: number, wp: any) => {
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
		});
		routingControl.addTo(map);

		removeRoutingTable();

		const openStreetMapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
		}).addTo(map);

		const baseMapsLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
		});

		const stadiamapsLayer = L.tileLayer(`https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png&api_key=${stadiaApiKey || ''}`, {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
		});

		const stadiaDarkLayer = L.tileLayer(`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png&api_key=${stadiaApiKey || ''}`, {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
		});

		const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
		});

		const baseLayers: { [key: string]: L.TileLayer } = {
			'OpenStreetMap': openStreetMapLayer,
			'Base Map': baseMapsLayer,
			// 'Stadia': stadiamapsLayer,
			// 'Stadia Dark': stadiaDarkLayer,
			"Sattelite": satelliteLayer
		};

		const layersControl = L.control.layers(baseLayers);
		layersControl.addTo(map);

		return () => {
			try {
				// Remove controls before removing the map to prevent cleanup errors
				if (routingControl) {
					try {
						map.removeControl(routingControl as any);
					} catch (e) {
						// Control might already be removed
					}
				}
				if (locateControl) {
					try {
						map.removeControl(locateControl as any);
					} catch (e) {
						// Control might already be removed
					}
				}
				if (layersControl) {
					try {
						map.removeControl(layersControl);
					} catch (e) {
						// Control might already be removed
					}
				}
				// Remove all layers before removing the map
				map.eachLayer((layer) => {
					try {
						if (map.hasLayer(layer)) {
							map.removeLayer(layer);
						}
					} catch (e) {
						// Ignore errors if layer is already removed
					}
				});
				// Finally remove the map
				if (map) {
					map.remove();
				}
			} catch (e) {
				// If map is already removed, just clear the container
				const mapContainer = document.getElementById('map');
				if (mapContainer) {
					mapContainer.innerHTML = '';
				}
			}
		};
	}, []);

	const removeRoutingTable = (): void => {
		const routingContainers = document.querySelectorAll('.leaflet-routing-container');
		routingContainers.forEach((container) => {
			(container as HTMLElement).style.display = 'none';
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

