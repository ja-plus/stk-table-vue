export const columns = [
    { title: 'Name', dataIndex: 'name', width: 200, className: 'my-td' },
    { title: 'Age', dataIndex: 'age', fixed: 'left', align: 'right', headerAlign: 'right' },
    { title: 'Gender', dataIndex: 'gender', width: 150 },
];

export const dataSource = new Array(5).fill(0).map((it, i) => ({
    id: 'id' + i,
    name: 'name' + i,
    age: Math.ceil(Math.random() * 100),
    gender: i % 2 === 0 ? 'male' : 'female',
}));
