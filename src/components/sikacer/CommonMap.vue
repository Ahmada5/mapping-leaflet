<template>
    <div id="map"></div>
</template>

<script lang="ts">
import {defineComponent, onMounted, watch} from 'vue';
import * as leaflet from 'leaflet';
import type {PropType} from 'vue';

interface Location {
    location: string;
    coordinates: [number, number];
    passengeraday: number;
    totalemploye: number;
}

export default defineComponent({
    name: 'CommonMap',
    props: {
        locations: {
            type: Array as PropType<Location[]>,
            required: true
        }
    },
    setup(props) {
        const initialLatitude = -6.2088;  // Jakarta's latitude
        const initialLongitude = 106.8456;  // Jakarta's longitude
        const initialZoom = 13;
        const maxZoom = 18;
        const minZoom = 13;

        const southWest = leaflet.latLng(-6.4, 106.7);  // Southwest boundary of Jakarta
        const northEast = leaflet.latLng(-6.0, 107.0);  // Northeast boundary of Jakarta
        const bounds = leaflet.latLngBounds(southWest, northEast);

        let map: leaflet.Map;

        onMounted(() => {
            map = leaflet.map('map', {
                maxBounds: bounds,
                maxBoundsViscosity: 1.0,
                minZoom: minZoom,
                maxZoom: maxZoom,
                attributionControl: false // Add this line to remove attribution control
            }).setView([initialLatitude, initialLongitude], initialZoom);

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(map);

            watch(() => props.locations, (newLocations) => {
                newLocations.forEach(location => {
                    const popupContent = `
                        <b>${location.location}</b>
                        <br>Total penumpang perhari: ${location.passengeraday}
                        <br>Total karyawan: ${location.totalemploye}<br>
                        `;
                    leaflet.marker([location.coordinates[1], location.coordinates[0]])
                        .addTo(map)
                        .bindPopup(popupContent);
                });
            }, {immediate: true});
            console.log("location.passengeraday")
        });

        const zoomToLocation = (location: Location) => {
            map.flyTo([location.coordinates[1], location.coordinates[0]], 16, {
                animate: true,
                duration: 1.5
            });
        };

        return {
            zoomToLocation
        };
    },
});
</script>

<style scoped>
#map {
    width: 100%;
    height: 1070px;;
}
</style>
