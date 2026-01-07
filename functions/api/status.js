export async function onRequestGet(context) {
    const services = [
        { name: 'Jellyfin', url: 'https://auburn82.manitoba.usbx.me/jellyfin/System/Info/Public' },
        { name: 'Jellyseerr', url: 'https://jellyseerr-auburn82.manitoba.usbx.me/api/v1/status' }
    ];
    
    const results = await Promise.all(services.map(async (service) => {
        try {
            const resp = await fetch(service.url, { method: 'GET' });
            return { name: service.name, online: resp.ok };
        } catch {
            return { name: service.name, online: false };
        }
    }));
    
    return new Response(JSON.stringify({ services: results, timestamp: Date.now() }), {
        headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=30',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
