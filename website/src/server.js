
import {getParserByID} from './parsers';

import express from 'express';
import bodyParser from 'body-parser';
import browserEnv from 'browser-env';
browserEnv();

const app = express()
app.use(express.json());

const port = 3300

function parse(parser, code, parserSettings) {
    if (!parser._promise) {
        parser._promise = new Promise(parser.loadParser);
    }
    return parser._promise.then(
        realParser => parser.parse(
            realParser,
            code,
            parserSettings || parser.getDefaultOptions(),
        ),
    );
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/health', (req, res) => {
    res.send('OK')
})

app.post('/parse', async (req, res) => {
    try{
        const request_object = req.body;
        const snippet = request_object.code;
        const parser_name = request_object.parser_name;
        const parser_setting = request_object.parser_setting;
        const parser =  getParserByID(parser_name)
        res.json({tree: await parse(parser, snippet,parser_setting)})
    }catch (e){
        console.error(e.stack)
        res.status(500).send(e)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

export default app;