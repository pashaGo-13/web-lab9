import express from 'express';
import bodyParser from 'body-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as store from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/catalog', async (req, res) => {
    const result = await store.getAll({
        search: req.query.search,
        sort: req.query.sort,
        page: req.query.page
    });

    res.render('catalog', { 
        animals: result.items, 
        totalPages: result.totalPages, 
        currentPage: result.currentPage,
        currentSort: req.query.sort || 'none',
        currentSearch: req.query.search || ''
    });
});

app.get('/items/:id', async (req, res) => {
    const animal = await store.getById(req.params.id);
    animal ? res.json(animal) : res.sendStatus(404);
});

app.post('/items', async (req, res) => {
    const newItem = await store.create(req.body);
    res.status(201).json(newItem);
});

app.put('/items/:id', async (req, res) => {
    const updated = await store.updateById(req.params.id, req.body);
    updated ? res.json(updated) : res.sendStatus(404);
});

app.delete('/items/:id', async (req, res) => {
    const success = await store.deleteById(req.params.id);
    success ? res.sendStatus(204) : res.sendStatus(404);
});

app.get('/chat', (req, res) => {
    res.render('chat'); // Отрисовка views/chat.ejs
});

export { app };