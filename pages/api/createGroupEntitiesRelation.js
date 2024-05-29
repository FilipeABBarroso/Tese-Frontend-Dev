import { backendClient } from "../../lib/api-client";

export default async function handler(req, res) {
    if(req.method === 'POST') {
        if(!req.body) {
            res.status(400).end();
        }
        try {
            const resBack = await backendClient.post('/createGroupEntitiesRelation', req.body);
            res.status(200).send(resBack.data);
        }catch(err) {
            if(err.response?.status === 400) {
                res.status(400).json(err.response.data);
                return;
            }
        }
    } else {
        res.status(405).end();
    }
}