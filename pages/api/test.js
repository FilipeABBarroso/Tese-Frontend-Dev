import { backendClient } from "../../lib/api-client";

export default async function handler(req, res, next) {
    if(req.method === 'GET') {
        /*if(!req.body) {
            res.status(400).end();
        }*/
        try {
            const resBack = await backendClient.get('/', {params: { 
                entityName: req.query.entityName,
                entityUrl: req.query.entityUrl,
                tag: req.query.tag,
                groupName: req.query.groupName,
            }});
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