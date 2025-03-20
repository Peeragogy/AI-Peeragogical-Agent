export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { file, status } = req.body;
        res.status(200).json({ message: `Revision for ${file} marked as ${status}.` });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

