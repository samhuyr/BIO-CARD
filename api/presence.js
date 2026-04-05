export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const USER_ID = '864213870494220341';
  const token = process.env.DISCORD_TOKEN;

  try {
    // Fetch user profile (includes avatar decoration)
    const userRes = await fetch(
      `https://discord.com/api/v10/users/${USER_ID}`,
      { headers: { Authorization: `Bot ${token}` } }
    );
    const user = await userRes.json();

    // Fetch presence via Lanyard
    const lanyardRes = await fetch(
      `https://api.lanyard.rest/v1/users/${USER_ID}`
    );
    const lanyard = await lanyardRes.json();

    // Build avatar decoration URL if present
    let decorationUrl = null;
    if (user.avatar_decoration_data?.asset) {
      decorationUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=256&passthrough=true`;
    }

    res.status(200).json({
      ...lanyard,
      decoration: decorationUrl,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch presence' });
  }
}
