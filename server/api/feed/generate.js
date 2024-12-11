import { generateFeed } from "../../controllers/xmlFeed.controller";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await generateFeed(req, res);  // Call the generateFeed function
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
