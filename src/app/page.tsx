// src/app/page.tsx
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapWithNoSSR = dynamic(() => import('./components/LeafletMap'), {
	ssr: false,
});

export default function Home() {
	return (
		<div>
			<div style={{
				width: '100%', marginBottom: '0', background: '#cecece', display: 'flex',
				flexDirection: 'row', justifyContent: 'start', alignItems: 'center', gap: '1rem',
				borderBottom: '2px solid #fed142'
			}}>
				<h2 style={{ textDecoration: 'underline' }}>Destinations Map</h2>
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
			<MapWithNoSSR />

		</div>
	);
}
