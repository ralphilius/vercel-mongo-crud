import { VercelRequest, VercelResponse, VercelRequestBody } from '@vercel/node';
import { Collection } from 'mongodb'
import db from '../../_lib/mongodb';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { collectionName, documentId } = req.query;
  // const { headers } = req.headers;

  db().then(async (database) => {
    const collection: Collection = database.collection(collectionName as string);
    switch (req.method) {
      case "GET":
        return res.status(200).json({ data: await collection.findOne({_id: documentId}) });
      case "PUT":
        const { document }: { document: VercelRequestBody } = req.body;
        return collection.findOne({_id: documentId})
          .then(doc => doc.updateOne({$set: document}))
          .then(value => res.status(200).json({data: value}));
      case 'DELETE':
        return collection.deleteOne({_id: documentId})
          .then(value => res.status(200).json({data: value}));
      default:
        return res.status(400).json({ message: 'HTTP Method not supported' });
    }
  })
}
