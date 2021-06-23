const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});
app.get('/bundle', (req, res) => {
    res.sendFile(`${__dirname}/public/index-bundle.html`);
});
app.get('/editor', (req, res) => {
    res.sendFile(`${__dirname}/public/index-editor.html`);
});
app.get('/editor-full', (req, res) => {
    res.sendFile(`${__dirname}/public/index-editor-full.html`);
});
app.get('/inspector', (req, res) => {
    res.sendFile(`${__dirname}/public/index-inspector.html`);
});
app.get('/picture', (req, res) => {
    res.sendFile(`${__dirname}/public/index-picture.html`);
});
app.listen(8000, () => {
    console.log('Application listening on port 8000!');
});