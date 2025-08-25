import { shallowRef } from 'vue';
export const dataSource = shallowRef([
    {
        id: '1-1-1', continent: 'Asia', country: 'China', province: 'Beijing',
        rowspan: {
            'continent': 7,
            'country': 3,
        }
    },
    { id: '1-1-2', continent: 'Asia', country: 'China', province: 'Shanghai' },
    { id: '1-1-3', continent: 'Asia', country: 'China', province: 'Guangzhou' },
    { id: '1-2-1', continent: 'Asia', country: 'Japan', province: 'Tokyo' },
    { id: '1-3-1', continent: 'Asia', country: 'Korea', province: 'Seoul' },
    { id: '1-4-1', continent: 'Asia', country: 'Vietnam', province: 'Hanoi' },
    { id: '1-5-1', continent: 'Asia', country: 'Thailand', province: 'Bangkok' },
    {
        id: '2-1-1', continent: 'Europe', country: 'France', province: 'Paris',
        rowspan: {
            'continent': 10,
        }
    },
    { id: '2-2-1', continent: 'Europe', country: 'England', province: 'England' },
    { id: '2-3-1', continent: 'Europe', country: 'Germany', province: 'Berlin' },
    { id: '2-4-1', continent: 'Europe', country: 'Spain', province: 'Madrid' },
    { id: '2-5-1', continent: 'Europe', country: 'Italy', province: 'Rome' },
    { id: '2-6-1', continent: 'Europe', country: 'Portugal', province: 'Lisbon' },
    { id: '2-7-1', continent: 'Europe', country: 'Russia', province: 'Moscow' },
    { id: '2-8-1', continent: 'Europe', country: 'Turkey', province: 'Ankara' },
    { id: '2-9-1', continent: 'Europe', country: 'Greece', province: 'Athens' },
    { id: '2-10-1', continent: 'Europe', country: 'Sweden', province: 'Stockholm' },
    // America
    {
        id: '3-1-1', continent: 'America', country: 'United States', province: 'Washington D.C.',
        rowspan: {
            'continent': 5,
        }
    },
    { id: '3-2-1', continent: 'America', country: 'Canada', province: 'Ottawa' },
    { id: '3-3-1', continent: 'America', country: 'Mexico', province: 'Mexico City' },
    { id: '3-4-1', continent: 'America', country: 'Brazil', province: 'Brasília' },
    { id: '3-5-1', continent: 'America', country: 'Argentina', province: 'Buenos Aires' },

    // Africa
    {
        id: '4-1-1', continent: 'Africa', country: 'Nigeria', province: 'Lagos',
        rowspan: {
            'continent': 5,
        }
    },
    { id: '4-2-1', continent: 'Africa', country: 'Ghana', province: 'Accra' },
    { id: '4-3-1', continent: 'Africa', country: 'Egypt', province: 'Cairo' },
    { id: '4-4-1', continent: 'Africa', country: 'South Africa', province: 'Pretoria' },
    { id: '4-5-1', continent: 'Africa', country: 'Kenya', province: 'Nairobi' },
    // Oceania
    {
        id: '5-1-1', continent: 'Oceania', country: 'Australia', province: 'Sydney',
        rowspan: {
            'continent': 5,
        }
    },
    { id: '5-2-1', continent: 'Oceania', country: 'New Zealand', province: 'Wellington' },
    { id: '5-3-1', continent: 'Oceania', country: 'Fiji', province: 'Suva' },
    { id: '5-4-1', continent: 'Oceania', country: 'Papua New Guinea', province: 'Port Moresby' },







]);