import { serveFeed } from "../../controllers/xmlFeed.controller";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await serveFeed(req, res);  // Call the serveFeed function
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
