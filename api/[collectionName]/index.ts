import { VercelRequest, VercelResponse, VercelRequestBody } from '@vercel/node';
import db from '../../_lib/mongodb';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { collectionName } = req.query;
  const { headers } = req.headers;
  //const database: Db = await db();

  db().then(async (database) => {
    const collection = await database.collection(collectionName as string);
    switch (req.method) {
      case "GET":
        return res.status(200).json({ data: await collection.find({}).toArray() });
      case "POST":
        const { document }: { document: VercelRequestBody } = req.body;
        return res.status(200).json({ data: await collection.insertOne(document) });
      default:
        return res.status(400).json({message: 'HTTP Method not supported'});
    }
  })
  


}