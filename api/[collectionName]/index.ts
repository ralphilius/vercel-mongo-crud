import { VercelRequest, VercelResponse, VercelRequestBody } from '@vercel/node';
import { Collection } from 'mongodb'
import db from '../../_lib/mongodb';
import { isValidJson } from '../../_lib/utils';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { collectionName } = req.query;
  const { headers } = req.headers;
  //const database: Db = await db();

  db().then(async (database) => {
    const collection: Collection = database.collection(collectionName as string);
    switch (req.method) {
      case "GET":
        let filter = {}, options = {};
        if(isValidJson(req.query.filter as string)){
          filter = JSON.parse(req.query.filter as string);
        }

        if(isValidJson(req.query.options as string)){
          options = JSON.parse(req.query.options as string);
        }
        
        return collection.find(filter, options).toArray()
          .then(values => res.status(200).json(values))
          .catch(error => {
            console.log(error)
            res.status(500).end()
          });
      case "POST":
        const { document }: { document: VercelRequestBody } = req.body;
        const id = document['_id'];
        delete document['_id'];
        return collection.updateOne({ _id: id }, { $set: document }, { upsert: true })
          .then(value => res.status(200).json(value))
          .catch(error => {
            console.log(error)
            res.status(500).end()
          });
      default:
        return res.status(400).json({message: 'HTTP Method not supported'});
    }
  })
  


}
