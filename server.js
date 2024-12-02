const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Включаем CORS
app.use(cors());
app.use(express.json()); // Для обработки JSON запросов

// База данных ключевых слов и URL
const keywords = {
    technology: ['https://jsonplaceholder.typicode.com/posts', 'https://jsonplaceholder.typicode.com/users'],
    science: ['https://jsonplaceholder.typicode.com/comments', 'https://jsonplaceholder.typicode.com/albums']
};

// Эндпоинт для получения списка URL по ключевому слову
app.post('/api/keywords', (req, res) => {
    const { keyword } = req.body;

    if (!keyword || !keywords[keyword]) {
        return res.status(404).json({ error: 'Keyword not found' });
    }

    res.json({ urls: keywords[keyword] });
});

// Эндпоинт для загрузки контента с выбранного URL
app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await axios.get(url);
        res.json({ content: response.data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch content from the URL' });
    }
});

// Раздача статических файлов клиентской части
app.use(express.static('public'));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
