export function colorizeBackground(k, r, g, b) {
    k.add([k.rect(k.canvas.width, k.canvas.height), 
        k.color(r, g, b), 
        k.fixed(),
    ]);
}

export async function fetchMapData(mapPath) {
    return await (await fetch(mapPath)).json();
}