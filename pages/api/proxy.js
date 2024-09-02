export default async function handler(req, res) {
    const DPP_IP = process.env.DPP_IP || '192.168.1.5';
    const url = `http://${DPP_IP}:7878/api/screenshot`;
  
    try {
      const externalResponse = await fetch(url, { mode: 'cors' });
      const blob = await externalResponse.blob();
      const headers = {};
      externalResponse.headers.forEach((value, name) => {
        headers[name] = value;
      });
  
      res.writeHead(externalResponse.status, headers);
      res.end(Buffer.from(await blob.arrayBuffer()));
    } catch (error) {
      console.error('Error fetching external API:', error);
      res.status(500).json({ error: 'Failed to fetch external API' });
    }
  }
  