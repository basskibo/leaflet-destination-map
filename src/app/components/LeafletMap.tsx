'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

interface Destination {
	name: string;
	lat: number;
	lon: number;
}

export default function Home() {
	const mapRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<L.Map | null>(null); // Correct type for Leaflet map
	const [destinations, setDestinations] = useState<Destination[]>([]);

	useEffect(() => {
		const fetchDestinations = async () => {
			const res = await fetch('/api/destinations');
			const data = await res.json();
			setDestinations(data);
		};

		fetchDestinations();

		const leafletMap = L.map(mapRef.current!).setView([20.0, 0.0], 2);

		const openStreetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
		}).addTo(leafletMap);

		const stamenTerrainLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
		});

		const baseMapLayer = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
		});

		const baseLayers = {
			'OpenStreetMap': openStreetMapLayer,
			'ARC Gis': stamenTerrainLayer,
			'Base Map': baseMapLayer
		};

		L.control.layers(baseLayers).addTo(leafletMap);

		setMap(leafletMap);
		return () => {
			leafletMap.remove();
		};
	}, []);

	useEffect(() => {
		if (map) {
			map.eachLayer((layer) => {
				if (layer instanceof L.Marker) {
					map.removeLayer(layer);
				}
			});

			destinations.forEach((destination) => {
				L.marker([destination.lat, destination.lon])
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
		<div className='mx-auto text-amber-400' style={{ background: '#010000', color: '#fed142' }}>

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
