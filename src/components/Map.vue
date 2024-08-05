<template>
	<div id="map" style="height: 600px;"></div>
	<div id="location-list" class="location-list">
		<ul>
			<li v-for="(location, index) in locations" :key="index" @click="zoomToLocation(index)">
				{{ location.location }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
//this map using static data location
import { defineComponent, onMounted, ref } from 'vue';
import * as leaflet from 'leaflet';

export default defineComponent({
	name: 'LeafletMap',
	setup() {
		const initialLatitude = -5.1559;
		const initialLongitude = 119.4646;
		const initialZoom = 13;

		const southWest = leaflet.latLng(-5.3, 119.3);
		const northEast = leaflet.latLng(-5.0, 119.6);
		const bounds = leaflet.latLngBounds(southWest, northEast);

		const locations = ref([
			{ location: "CCTV Traffic Samratulangi01", coordinates: [119.417213, -5.160381] },
			{ location: "REKLAME JL. BULU SARAUNG", coordinates: [119.417182, -5.132984] },
			{ location: "CCTV Traffic Nusantara 02", coordinates: [119.409308, -5.123051] },
			{ location: "JL.A.P.PETTARANI-DPN LIVING PLZ", coordinates: [119.43558, -5.1631] },
			{ location: "JL.A.P.PETTARANI-DPN POS MKS", coordinates: [119.43504, -5.16478] },
			{ location: "CCTV Traffic Samratulangi", coordinates: [119.415633, -5.148509] },
			{ location: "JL.A.P.PETTARANI-DPN THE MUTIARA", coordinates: [119.43947, -5.1392] },
			{ location: "CCTV Traffic Analytic Jl. HjBau", coordinates: [119.41101, -5.14857] },
			{ location: "CCTV Traffic Bts Kota Goa - Mks", coordinates: [119.441469, -5.188556] },
			{ location: "JL.A.P.PETTARANI-DPN KEMENAG", coordinates: [119.43793, -5.14789] },
			{ location: "CCTV Traffic Nusantara", coordinates: [119.405366, -5.131569] }
		]);

		let map: leaflet.Map;

		onMounted(() => {
			map = leaflet.map('map').setView([initialLatitude, initialLongitude], initialZoom);

			leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
			}).addTo(map);

			map.setMaxBounds(bounds);

			locations.value.forEach(location => {
				leaflet.marker([location.coordinates[1], location.coordinates[0]]).addTo(map);
			});
		});

		const zoomToLocation = (index: number) => {
			const location = locations.value[index];
			map.flyTo([location.coordinates[1], location.coordinates[0]], 16, {
				animate: true,
				duration: 1.5 // duration of the smooth transition in seconds
			});
		};

		return {
			locations,
			zoomToLocation
		};
	},
});
</script>

<style scoped>
#map {
	width: 100%;
	height: 100%;
}

.location-list {
	position: absolute;
	top: 10px;
	left: 10px;
	background-color: white;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	z-index: 1000;
}

.location-list ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.location-list li {
	cursor: pointer;
	padding: 5px;
	margin: 5px 0;
	background-color: #f9f9f9;
	border-radius: 3px;
	transition: background-color 0.3s;
}

.location-list li:hover {
	background-color: #e0e0e0;
}
</style>