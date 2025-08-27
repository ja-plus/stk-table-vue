import { shallowRef } from 'vue';
export const dataSource = shallowRef([
    {
        id: '1-1-1', continent: 'Asia', country: 'China', province: 'Beijing',
        rowspan: {
            'continent': 12,
            'country': 6,
        }
    },
    { id: '1-1-2', continent: 'Asia', country: 'China', province: 'Taiwan' },
    { id: '1-1-3', continent: 'Asia', country: 'China', province: 'Shanghai' },
    { id: '1-1-4', continent: 'Asia', country: 'China', province: 'Guangdong' },
    { id: '1-1-5', continent: 'Asia', country: 'China', province: 'Zhejiang' },
    { id: '1-1-6', continent: 'Asia', country: 'China', province: 'Hongkong' },
    { id: '1-2-1', continent: 'Asia', country: 'Japan', province: 'Tokyo', rowspan: { country: 2 } },
    { id: '1-2-2', continent: 'Asia', country: 'Japan', province: 'Osaka' },
    { id: '1-3-1', continent: 'Asia', country: 'Korea', province: 'Seoul', rowspan: { country: 2 } },
    { id: '1-3-2', continent: 'Asia', country: 'Korea', province: 'Busan' },
    { id: '1-4-1', continent: 'Asia', country: 'Vietnam', province: 'Hanoi' },
    { id: '1-5-1', continent: 'Asia', country: 'Thailand', province: 'Bangkok' },
    {
        id: '2-1-1', continent: 'Europe', country: 'England', province: 'England',
        rowspan: {
            'continent': 13,
        }
    },
    { id: '2-2-1', continent: 'Europe', country: 'France', province: 'Paris' },
    { id: '2-3-1', continent: 'Europe', country: 'Germany', province: 'Berlin' },
    { id: '2-4-1', continent: 'Europe', country: 'Spain', province: 'Madrid' },
    { id: '2-5-1', continent: 'Europe', country: 'Italy', province: 'Rome' },
    { id: '2-6-1', continent: 'Europe', country: 'Portugal', province: 'Lisbon' },
    { id: '2-7-1', continent: 'Europe', country: 'Russia', province: 'Moscow' },
    { id: '2-8-1', continent: 'Europe', country: 'Turkey', province: 'Ankara' },
    { id: '2-9-1', continent: 'Europe', country: 'Greece', province: 'Athens' },
    { id: '2-10-1', continent: 'Europe', country: 'Sweden', province: 'Stockholm' },
    { id: '2-11-1', continent: 'Europe', country: 'Finland', province: 'Helsinki', rowspan: {country: 3} },
    { id: '2-11-2', continent: 'Europe', country: 'Finland', province: 'Rovaniemi' },
    { id: '2-11-3', continent: 'Europe', country: 'Finland', province: 'Tampere' },


    // America
    {
        id: '3-1-1', continent: 'America', country: 'United States', province: 'Washington D.C.',
        rowspan: {
            continent: 11,
            country: 7
        }
    },
    { id: '3-1-2', continent: 'America', country: 'United States', province: 'New York', },
    { id: '3-1-3', continent: 'America', country: 'United States', province: 'Los Angeles', },
    { id: '3-1-4', continent: 'America', country: 'United States', province: 'Chicago', },
    { id: '3-1-5', continent: 'America', country: 'United States', province: 'Houston', },
    { id: '3-1-6', continent: 'America', country: 'United States', province: 'Philadelphia', },
    { id: '3-1-7', continent: 'America', country: 'United States', province: 'San Antonio', },
    { id: '3-2-1', continent: 'America', country: 'Canada', province: 'Toronto' },
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
            'continent': 4,
        }
    },
    { id: '5-2-1', continent: 'Oceania', country: 'New Zealand', province: 'Wellington' },
    { id: '5-3-1', continent: 'Oceania', country: 'Fiji', province: 'Suva' },
    { id: '5-4-1', continent: 'Oceania', country: 'Papua New Guinea', province: 'Port Moresby' },
]);


export const specialDataSource = shallowRef([
    { id: '01', a: '1', b: '2', c: '3', rowspan: { a: 2, b: 4, c: 5 } },
    { id: '02', a: '1', b: '2', c: '3' },
    { id: '03', a: '1', b: '2', c: '3', rowspan: { a: 6 } },
    { id: '04', a: '1', b: '2', c: '3' },
    { id: '05', a: '1', b: '2', c: '3' },
    { id: '06', a: '1', b: '2', c: '3' },
    { id: '07', a: '1', b: '2', c: '3', rowspan: { c: 3 } },
    { id: '08', a: '1', b: '2', c: '3', rowspan: { b: 7 } },
    { id: '09', a: '1', b: '2', c: '3' },
    { id: '10', a: '1', b: '2', c: '3' },
    { id: '11', a: '1', b: '2', c: '3', rowspan: { a: 3 } },
    { id: '12', a: '1', b: '2', c: '3', rowspan: { c: 8 } },
    { id: '13', a: '1', b: '2', c: '3' },
    { id: '14', a: '1', b: '2', c: '3', rowspan: { a: 10 } },
    { id: '15', a: '1', b: '2', c: '3', rowspan: { b: 5 } },
    { id: '16', a: '1', b: '2', c: '3' },
    { id: '17', a: '1', b: '2', c: '3' },
    { id: '18', a: '1', b: '2', c: '3' },
    { id: '19', a: '1', b: '2', c: '3' },
    { id: '20', a: '1', b: '2', c: '3', rowspan: { b: 9 } },
    { id: '21', a: '1', b: '2', c: '3', rowspan: { c: 6 } },
    { id: '22', a: '1', b: '2', c: '3' },
    { id: '23', a: '1', b: '2', c: '3' },
    { id: '24', a: '1', b: '2', c: '3' },
    { id: '25', a: '1', b: '2', c: '3' },
    { id: '26', a: '1', b: '2', c: '3' },
    { id: '27', a: '1', b: '2', c: '3' },
    { id: '28', a: '1', b: '2', c: '3', rowspan: { a: 3 } },
    { id: '29', a: '1', b: '2', c: '3' },
    { id: '30', a: '1', b: '2', c: '3' },
])