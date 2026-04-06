export async function onRequest(context) {
  const USER_ID = '864213870494220341';
  const token = context.env.DISCORD_TOKEN;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': 'application/json',
  };

  try {
    const [userRes, lanyardRes] = await Promise.all([
      fetch(`https://discord.com/api/v10/users/${USER_ID}`, {
        headers: { Authorization: `Bot ${token}` },
      }),
      fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`),
    ]);

    const user = await userRes.json();
    const lanyard = await lanyardRes.json();

    let decorationUrl = null;
    if (user.avatar_decoration_data?.asset) {
      decorationUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=256&passthrough=true`;
    }

    return new Response(JSON.stringify({ ...lanyard, decoration: decorationUrl }), {
      status: 200,
      headers,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch presence' }), {
      status: 500,
      headers,
    });
  }
}
