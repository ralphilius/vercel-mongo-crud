import { VercelRequest, VercelResponse, VercelRequestBody } from '@vercel/node';
import { Collection, ObjectID } from 'mongodb'
import db from '../../_lib/mongodb';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { collectionName, documentId } = req.query;
  // const { headers } = req.headers;
  const docId = ObjectID.createFromHexString(documentId as string);
  db().then(async (database) => {
    const collection: Collection = database.collection(collectionName as string);
    switch (req.method) {
      case "GET":
        return collection.findOne({_id: docId})
          .then(val => res.status(200).json(val))
          .catch(error => {
            console.log(error)
            res.status(500).end()
          });
      case "PUT":
        const { document }: { document: VercelRequestBody } = req.body;
        return collection.findOne({_id: docId})
          .then(doc => doc.updateOne({$set: document}))
          .then(value => res.status(200).json(value))
          .catch(error => {
            console.log(error)
            res.status(500).end()
          });
      case 'DELETE':
        return collection.deleteOne({_id: docId})
          .then(value => res.status(200).json(value))
          .catch(error => {
            console.log(error)
            res.status(500).end()
          });
      default:
        return res.status(400).json({ message: 'HTTP Method not supported' });
    }
  })
}
