import { colorizeBackground, fetchMapData } from "../utils.js";

export default async function world(k) {
    colorizeBackground(k, 76, 170, 255);
    const mapData = await fetchMapData("./graphics/world/world.json");

    const map = k.add([k.pos(0, 0)]);

    const entities = {
        player: null,
        slimes: [],
    };

    const layers = mapData.layers;
    for (const layer of layers) {
        if (layer.name = "Collisions") {
            // TODO
            continue;
        }

        if layer.name == ""
    }
}
