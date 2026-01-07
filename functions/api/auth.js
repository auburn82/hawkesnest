export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const body = await request.json();
        const { username, password } = body;
        
        const jellyfinAuth = await fetch('https://auburn82.manitoba.usbx.me/jellyfin/Users/AuthenticateByName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Emby-Authorization': 'MediaBrowser Client="HawkesNest", Device="Web", DeviceId="hawkesnest-portal", Version="1.0.0"'
            },
            body: JSON.stringify({ Username: username, Pw: password })
        });
        
        if (jellyfinAuth.ok) {
            const data = await jellyfinAuth.json();
            return new Response(JSON.stringify({
                success: true,
                user: data.User.Name,
                token: data.AccessToken,
                userId: data.User.Id
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid credentials'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Authentication failed'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
