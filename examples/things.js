
var createGame = require('voxel-engine')
var game = createGame({
	texturePath: './textures/',
    	materials: [['grass', 'dirt', 'grass_dirt'], 'obsidian', 'dirt', 'whitewool', 'dirt', 'brick'],
	generate: function(x,y,z) { return y < -20 ? 1 : 0 }
 })
    
game.controls.pitchObject.rotation.x = -1.5;
game.appendTo('#container');
window.game = game;

var putter = require('voxel-put-something')(game);
var creator = require('voxel-things');
for (var i = 0; i < 2; i++) {
    var height = (Math.random() * 5) + 4;
    putter.put(creator({
        object: "tree", 
        material: [8,9],
        height: height,
        radius: (Math.random() * (height/6) + (height/4))
    }));
}

var thing = creator({ object: "hibert", material: [2,3]} );
putter.put(thing);

var thing = creator({ object: "flowsnake", material: [3,4] } );
putter.put(thing);

// obtain pointer lock
container.addEventListener('click', function() {
  game.requestPointerLock(container);
  // Close share dialog when clicking back to game
  game.pointer.on('attain', share.close.bind(share));
});
