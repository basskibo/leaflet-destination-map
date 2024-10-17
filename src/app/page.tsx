// src/app/page.tsx
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapWithNoSSR = dynamic(() => import('./components/LeafletMap'), {
	ssr: false,
});

export default function Home() {
	return (
			<MapWithNoSSR />
	);
}
