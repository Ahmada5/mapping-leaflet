<template>
    <div>
        <CommonMap :locations="locations" ref="commonMap"/>
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
import {defineComponent, onMounted, ref} from 'vue';
import axios from 'axios';
import CommonMap from './CommonMap.vue';

interface Location {
    location: string;
    coordinates: [number, number];
    totalMatch: number;
    totalVehicle: number;
}

export default defineComponent({
    name: 'MapLandpage',
    components: {
        CommonMap
    },
    setup() {
        const locations = ref<Location[]>([]);

        onMounted(async () => {
            try {
                const response = await axios.get('http://localhost:3000/data');
                locations.value = response.data.data.map((item: any) => ({
                    location: item.location,
                    coordinates: item.geometry.coordinates,
                    passengeraday: item.passengeraday,
                    totalemploye: item.totalemploye
                }));
                console.log(locations.value);

            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        });

        const commonMap = ref(null);

        const zoomToLocation = (index: number) => {
            const location = locations.value[index];
            if (commonMap.value) {
                (commonMap.value as any).zoomToLocation(location);
            }
        };

        return {
            locations,
            zoomToLocation,
            commonMap
        };
    },
});
</script>

<style scoped>
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
