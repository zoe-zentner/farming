def setup(self):
    tmx_data = load_pygame('Animations/data/map.tmx')

    # house
    for layer in ['HouseFloor', 'HouseFurnitureBottom']:
        for x, y, surf in tmx_data.get_layer_by_name(layer).tiles():
            Generic((x * TILE_SIZE, y * TILE_SIZE), surf, self.all_sprites, LAYERS['house bottom'])

    for layer in ['HouseWalls', 'HouseFurnitureTop']:
        for x, y, surf in tmx_data.get_layer_by_name(layer).tiles():
            Generic((x * TILE_SIZE, y * TILE_SIZE), surf, self.all_sprites, LAYERS['main'])

    # fence
    for x, y, surf in tmx_data.get_layer_by_name('Fence').tiles():
        Generic((x * TILE_SIZE, y * TILE_SIZE), surf, [self.all_sprites, self.collision_sprites], LAYERS['main'])

    # water
    water_frames = import_folder('Animations/graphics/water')
    for x, y, surf in tmx_data.get_layer_by_name('Water').tiles():
        Water((x * TILE_SIZE, y * TILE_SIZE), water_frames, self.all_sprites, LAYERS['main'])

    # trees
    for obj in tmx_data.get_layer_by_name('Trees'):
        Tree(
            pos=(obj.x, obj.y),
            surf=obj.image,
            groups=[self.all_sprites, self.collision_sprites, self.tree_sprites],
            name=obj.name,
            player_add=self.player_add)

    # wildflowers
    for obj in tmx_data.get_layer_by_name('Decoration'):
        WildFlower((obj.x, obj.y), obj.image, [self.all_sprites, self.collision_sprites])

    # collision tiles
    for x, y, surf in tmx_data.get_layer_by_name('Collision').tiles():
        Generic((x * TILE_SIZE, y * TILE_SIZE), pygame.Surface((TILE_SIZE, TILE_SIZE)), self.collision_sprites)