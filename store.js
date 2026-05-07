import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, 'db.json');

const readData = async () => {
    const data = await fs.readFile(dbFile, 'utf-8');
    return JSON.parse(data);
};

const saveChanges = async (data) => {
    await fs.writeFile(dbFile, JSON.stringify(data, null, 2));
};

export const getAll = async (params = {}) => {
    let data = await readData();
    const { search, sort, page = 1, limit = 5 } = params;

    if (search) {
        const query = search.toLowerCase();
        data = data.filter(item => item.name.toLowerCase().includes(query));
    }

    if (sort === 'asc') {
        data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'desc') {
        data.sort((a, b) => b.name.localeCompare(a.name));
    }

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = data.slice(startIndex, startIndex + limit);

    return {
        items: paginatedData,
        totalPages,
        currentPage: parseInt(page)
    };
};

export const getById = async (id) => {
    const data = await readData();
    return data.find(item => item.id === parseInt(id));
};

export const create = async (newItemData) => {
    const data = await readData();
    const maxId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
    const newItem = { ...newItemData, id: maxId + 1 };
    data.push(newItem);
    await saveChanges(data);
    return newItem;
};

export const updateById = async (id, updatedFields) => {
    const data = await readData();
    const index = data.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
        data[index] = { ...data[index], ...updatedFields, id: data[index].id };
        await saveChanges(data);
        return data[index];
    }
    return null;
};

export const deleteById = async (id) => {
    const data = await readData();
    const filtered = data.filter(item => item.id !== parseInt(id));
    await saveChanges(filtered);
    return data.length !== filtered.length;
};