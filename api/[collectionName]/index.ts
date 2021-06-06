import { VercelRequest, VercelResponse, VercelRequestBody } from '@vercel/node';
import { Collection } from 'mongodb'
import db from '../../_lib/mongodb';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { collectionName } = req.query;
  const { headers } = req.headers;
  //const database: Db = await db();

  db().then(async (database) => {
    const collection: Collection = database.collection(collectionName as string);
    switch (req.method) {
      case "GET":
        return collection.find({}).toArray()
          .then(values => res.status(200).json(values))
          .catch(error => res.status(500).end());
      case "POST":
        const { document }: { document: VercelRequestBody } = req.body;
        return collection.insertOne(document)
          .then(value => res.status(200).json(value))
          .catch(error => res.status(500).end());
      default:
        return res.status(400).json({message: 'HTTP Method not supported'});
    }
  })
  


}