'use client'; // Mark this component as a client component

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define the interface for a Destination
interface Destination {
	name: string;
	lat: number;
	lon: number;
}

export default function Home() {
	const mapRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<L.Map | null>(null);
	const [destinations, setDestinations] = useState<Destination[]>([]);

	useEffect(() => {
		// Fetch data from the Next.js internal API route
		const fetchDestinations = async () => {
			const res = await fetch('/api/destinations');
			const data = await res.json();
			setDestinations(data);
		};

		fetchDestinations();

		// Initialize the map
		const leafletMap = L.map(mapRef.current!).setView([20.0, 0.0], 2);

		// Define base layers
		const openStreetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
		}).addTo(leafletMap);

		const stamenTerrainLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
		});

		const baseMapLayer = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
		});

		// Control for base layers
		const baseLayers = {
			'OpenStreetMap': openStreetMapLayer,
			'ARC Gis': stamenTerrainLayer,
			'Base Map' : baseMapLayer
		};

		// Add layer control
		L.control.layers(baseLayers).addTo(leafletMap);

		// Cleanup on unmount
		setMap(leafletMap);
		return () => {
			leafletMap.remove();
		};
	}, []);

	useEffect(() => {
		// Add markers to the map
		if (map) {
			// Clear existing markers to avoid duplication
			map.eachLayer((layer) => {
				if (layer instanceof L.Marker) {
					map.removeLayer(layer);
				}
			});

			destinations.forEach((destination) => {
				const marker = L.marker([destination.lat, destination.lon])
					.addTo(map)
					.bindPopup(destination.name);
			});
		}
	}, [map, destinations]);

	const zoomToCity = (lat: number, lon: number) => {
		if (map) {
			map.setView([lat, lon], 10);
		}
	};

	return (
		<div className='mx-auto text-amber-400'>
			<h1 className='font-extrabold text-2xl'>Destinations Map</h1>
			<div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>

			<h2 className='font-semibold text-xl'>List of Cities and Coordinates</h2>
			<table>
				<thead>
					<tr>
						<th>City</th>
						<th>Latitude</th>
						<th>Longitude</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{destinations.map((destination) => (
						<tr key={destination.name}>
							<td>{destination.name}</td>
							<td>{destination.lat}</td>
							<td>{destination.lon}</td>
							<td>
								<button className='font-bold rounded-md border-2 border-neutral-800 p-2 hover:bg-amber-600 hover:text-neutral-900' onClick={() => zoomToCity(destination.lat, destination.lon)}>
									Go to
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th,
        td {
          padding: 8px;
          border: 1px solid black;
        }
        th {
          background-color: #888;
        }
      `}</style>
		</div>
	);
}
