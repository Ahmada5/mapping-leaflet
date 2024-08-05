<template>
	<div>
		<div id="map" style="height: 1070px;"></div>
		<div id="location-list" class="location-list">
			<ul>
				<li v-for="(location, index) in locations" :key="index" @click="zoomToLocation(index)">
					{{ location.location }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
//this map using npoint, take a look the backend in another
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import * as leaflet from 'leaflet';

interface Location {
	location: string;
	coordinates: [number, number];
}

export default defineComponent({
	name: 'LeafletMap',
	setup() {
        const initialLatitude = -6.2088;  // Jakarta's latitude
        const initialLongitude = 106.8456;  // Jakarta's longitude
        const initialZoom = 13;
        const maxZoom = 18;
        const minZoom = 13;

        const southWest = leaflet.latLng(-6.4, 106.7);  // Southwest boundary of Jakarta
        const northEast = leaflet.latLng(-6.0, 107.0);  // Northeast boundary of Jakarta
        const bounds = leaflet.latLngBounds(southWest, northEast);

		const locations = ref<Location[]>([]);

		let map: leaflet.Map;

		onMounted(async () => {
			map = leaflet.map('map', {
				maxBounds: bounds,
				maxBoundsViscosity: 1.0,
				minZoom: minZoom,
				maxZoom: maxZoom
			}).setView([initialLatitude, initialLongitude], initialZoom);

			leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
			}).addTo(map);

			try {
				const response = await axios.get('http://localhost:3000/npoint');
                console.log(response)
				locations.value = response.data.data.map((item: any) => ({
					location: item.location,
					coordinates: item.coordinates
				}));

				locations.value.forEach(location => {
					leaflet.marker([location.coordinates[1], location.coordinates[0]]).addTo(map)
						.bindPopup(location.location);
				});

				console.log("after get = " + locations);

			} catch (error) {
				console.error('Error fetching locations:', error);
			}
		});

		const zoomToLocation = (index: number) => {
			const location = locations.value[index];
			console.log("set it = " + location);
			console.log(`the data =  ${JSON.stringify(location)}`);
			console.log("the location = "+ location.coordinates[1]+" - "+location.coordinates[0]);

			map.flyTo([location.coordinates[1], location.coordinates[0]], 16, {
				animate: true,
				duration: 1.5
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
