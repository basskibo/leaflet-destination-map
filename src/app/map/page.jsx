"use client";

import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

const MapPage = () => {
    useEffect(() => {
        const loadLeaflet = async () => {
            const L = await import('leaflet');
            await import('leaflet-routing-machine');

            if (typeof window !== 'undefined') {
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

                L.Routing.control({
                    waypoints: waypoints,
                    router: L.Routing.osrmv1({
                        serviceUrl: 'https://router.project-osrm.org/route/v1'
                    }),
                    createMarker: (i, wp) => {
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

                // Cleanup function to remove map on component unmount
                return () => {
                    map.remove();
                };
            }
        };

        loadLeaflet(); // Call the function to load Leaflet and initialize the map
    }, []);

    return (
        <>
            <div id="map" style={{ height: '100vh', width: '100%' }}></div>
        </>
    );
};

export default MapPage;
