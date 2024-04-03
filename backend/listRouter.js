import { Router } from 'express';
import fs from 'fs';

const listRouter = Router();

const listFile = 'data/lists.json';

listRouter.get('/getLists', (req, res) => {
    const lists = JSON.parse(fs.readFileSync(listFile));
    res.send(JSON.stringify(lists));
});

listRouter.post('/addList', (req, res) => {
    const lists = JSON.parse(fs.readFileSync(listFile));
    lists.push(req.body.list);
    fs.writeFileSync(listFile, JSON.stringify(lists));
    res.send(JSON.stringify(lists));
});

listRouter.post('/deleteList', (req, res) => {
    const lists = JSON.parse(fs.readFileSync(listFile));

    const newList = lists.filter(list => list.id !== req.body.list.id);

    fs.writeFileSync(listFile, JSON.stringify(newList));
    res.send(JSON.stringify(newList));
});

listRouter.post('/updateList', (req, res) => {
    const lists = JSON.parse(fs.readFileSync(listFile));
    const newList = req.body.list;
    
    newList.elements.sort((a, b) => {
        // First, sort by "checked" property
        if (a.checked && !b.checked) {
            return -1; // a comes before b if a.checked is true and b.checked is false
        }
        if (!a.checked && b.checked) {
            return 1; // b comes before a if b.checked is true and a.checked is false
        }
        // If both have the same "checked" status, sort alphabetically by "name"
        return a.name.localeCompare(b.name);
    });
    

    const index = lists.findIndex(list => list.id === newList.id);
    if (index !== -1) {
        lists[index] = newList;
    } else {
        res.status(404).send("List not found");
    }

    lists.sort((a, b) => a.name.localeCompare(b.name));

    fs.writeFileSync(listFile, JSON.stringify(lists, null, 2));
    res.send(JSON.stringify(newList));
});



export default listRouter;