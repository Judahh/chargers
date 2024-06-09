import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

function setdata(object:unknown){
    return object;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // proxy request to the API
    const url = req.query.serviceUrl as string;
    let method = req.query.serviceMethod as string;
    delete req.query.serviceUrl;
    delete req.query.serviceMethod;
    const referer = req.query.serviceReferer as string;
    delete req.query.serviceReferer;
    method = method || req.method as string;
    const headers = req.headers as any;
    let body = req.body;
    const query = req.query;
    delete headers['Content-Length'];
    delete headers['content-length'];
    delete headers['Host'];
    delete headers['host'];
    headers['Accept'] = '*/*';
    if(referer) {
        headers['referer'] = referer;
    }
    headers['Referer'] = headers['referer'];
    headers['Content-Type'] = headers['content-type'];

    if (method.toUpperCase() === 'OPTIONS') {
        return res.status(200).send();
    }

    if (url.includes('audi') || url.includes('zletric')) {
        delete headers['Origin'];
        delete headers['origin'];
    }

    // if body is string, parse it as json
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
            headers['Content-Type'] = 'application/json';
        } catch (e) {
            if (url.includes('audi')) {
                console.log('body is not a json', body);
            }
            body = body.trim();
        }
    }

    // if body is empty, set it to undefined
    if (Object.keys(body).length === 0) {
        body = undefined;
    }

    // if (!url.includes('ezvolt')) {
    //     console.log(url, method, headers, body, query);
    // }

    if (url.includes('audi')) {
        console.log(url, method, headers, body, query);
    }

    //disable SSL verification
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const data = await axios({
        url,
        method,
        headers,
        data: body,
        params: query,
        maxBodyLength: Infinity,
    });

    // data can be json or javascript script

    const json = data.data;
    if(data.status != 200) {
        if (url.includes('audi')) {
            console.log('result',json);
        }
    } else {
        if (url.includes('audi')) {
            console.log('result',json);
        }
    }
    // check if the data is json
    if (typeof json === 'object') {
        return res.status(data.status).json(json);
    } else {
        // remove 'data(' and ');' from the response
        const text = eval('set'+json);
        // try to parse the text as json
        try {
            const json = JSON.parse(text);
            return res.status(data.status).json(json);
        } catch (e) {
            // if it fails, send the text
            console.log('error', e);
            res.status(data.status).send(text);
        }
    }
}
