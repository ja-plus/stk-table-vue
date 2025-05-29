import { StkTableColumn } from '@/StkTable';

export const columns: StkTableColumn<any>[] = [
    { type: 'tree-node', title: 'Area', dataIndex: 'area' },
    { title: 'GDP', dataIndex: 'gdp', align: 'right' },
    { title: 'Population', dataIndex: 'population', align: 'right' },
    { title: 'GDP per capita', dataIndex: 'gdpPerCapita', align: 'right' },
];
export const getDataSource = () => [
    {
        area: 'Asia',
        gdp: 10000,
        population: 50000000,
        gdpPerCapita: 20000,
        children: [
            {
                area: 'China',
                gdp: 5000,
                population: 1400000000,
                gdpPerCapita: 35000,
                children: [
                    { area: 'Beijing', gdp: 2000, population: 21000000, gdpPerCapita: 9000 },
                    { area: 'Shanghai', gdp: 3000, population: 24000000, gdpPerCapita: 12000 },
                    {
                        area: 'Zhejiang',
                        gdp: 4000,
                        population: 23000000,
                        gdpPerCapita: 11000,
                        children: [
                            {
                                area: 'Hangzhou',
                                gdp: 4000,
                                population: 23000000,
                                gdpPerCapita: 11000,
                            },
                        ],
                    },
                    { area: 'Guangzhou', gdp: 4000, population: 23000000, gdpPerCapita: 11000 },
                ],
            },
            {
                area: 'Japan',
                gdp: 4000,
                population: 126000000,
                gdpPerCapita: 33000,
                children: [{ area: 'Tokyo', gdp: 1000, population: 13900000, gdpPerCapita: 7000 }],
            },
            {
                area: 'Korea',
                gdp: 3000,
                population: 51000000,
            },
        ],
    },
    {
        area: 'Europe',
        gdp: 8000,
        population: 740000000,
        children: [
            { area: 'Germany', gdp: 8000, population: 740000000 },
            { area: 'France', gdp: 8000, population: 740000000 },
        ],
    },
    { area: 'Africa', gdp: 6000, population: 1010000000 },
    {
        area: 'North America',
        gdp: 5000,
        population: 301000000,
        children: [
            {
                area: 'USA',
                gdp: 5000,
                population: 301000000,
                children: [
                    { area: 'New York', gdp: 5000, population: 301000000 },
                    { area: 'Los Angeles', gdp: 5000, population: 301000000 },
                ],
            },
            { area: 'Canada', gdp: 5000, population: 301000000 },
        ],
    },
    {
        area: 'South America',
        gdp: 4000,
        population: 421000000,
        children: [
            { area: 'Brazil', gdp: 4000, population: 421000000 },
            { area: 'Argentina', gdp: 4000, population: 421000000 },
        ],
    },
    { area: 'Australia', gdp: 3000, population: 251000000 },
];
