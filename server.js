import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';

import listRouter from './backend/listRouter.js';

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
    
// Serve the HTML pages from the public directory
app.use('/',express.static('public'));
app.use('/admin',express.static('public/admin.html'));

app.use(express.json());



app.use('/api/lists', listRouter);





app.get('/api/lists/getLists', (req, res) => {
    const lists = JSON.parse(fs.readFileSync('data/lists.json'));
    res.send(JSON.stringify(lists));
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
