import { Db, MongoClient } from 'mongodb';
const url = require('url')

let cachedDb: Db = null
async function connectToDatabase(uri: string): Promise<Db> {
  if (cachedDb) {
    return cachedDb
  }

  const client: MongoClient = await MongoClient.connect(uri, { useNewUrlParser: true })
  const db: Db = await client.db(url.parse(uri).pathname.substr(1))
  cachedDb = db
  return db
}

export default async(): Promise<Db> => {
  return connectToDatabase(process.env.MONGODB_URI)
}