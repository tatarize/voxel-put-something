module.exports = function (game, opts) {
    if (!opts) opts = {};
    
    var voxels = game.voxels;
    var bounds = boundingChunks(voxels.chunks);
    var step = voxels.chunkSize * voxels.cubeSize;
        
    var ymax = bounds.y.max * step;
    var ymin = bounds.y.min * step;
       
    var updated = {};
    var pos = [];
     
    this.setPosition = function(position) {
        pos[0] = position.x;
        pos[1] = position.y;
        pos[2] = position.z;
     }
     
    this.randomLocation = function() {
        var randposition = randomPosition();
        setPosition(randposition);
        surface();
    };
    
    this.put = function(thing,options) {
        if (!options) options = {};
        if (options.position) setPosition(options.position);
        else {randomLocation();}
        if (!options.scale) options.scale = 1;
        
        var size = game.cubeSize * options.scale;
                
        var xoffset = pos[0];
        var yoffset = pos[1];
        var zoffset = pos[2];
        
        var x, y, z;
        thing.forEach(function(geometry) {
            geometry.map(function(point) {
                x = xoffset + point[0] * size;
                y = yoffset + point[1] * size;
                z = zoffset + point[2] * size;
                set({
                    x: x,
                    y: y, 
                    z: z
                }, (point[3])?point[3]:options.materials);
            })
        })
        flush();
    }
    
    function surface() {
        var initialy = pos[1];
        if (occupied(pos[1])) {
            for (; occupied(pos[1]); pos[1] += voxels.cubeSize) {
                if ((pos[1] >= ymax) || (pos[1] <= ymin)) {
                    pos[1] = initialy;
                    return;
                }
            }
        } //if something exists, move spawn location up.
        else {
            for (; !occupied(pos[1]); pos[1] -= voxels.cubeSize) {
                if ((pos[1] >= ymax) || (pos[1] <= ymin)) {
                    pos[1] = initialy;
                    return;
                }
            }
        } //if something doesn't exist, move spawn location down.'
    }
    
    function randomPosition() {
        var chunk = voxels.chunks[randomChunk(bounds)];
        var randompos = {
            x: (chunk.position[0] + Math.random()) * step,
            y: (chunk.position[1] + Math.random()) * step,
            z: (chunk.position[2] + Math.random()) * step
        };
        return randompos;
    }
    
    function occupied (y) {
        return y <= ymax && y >= ymin && voxels.voxelAtPosition({
            x: pos[0], 
            y: y, 
            z: pos[2]
            });
    }
    
    function set (posxyz, value) {
        var ex = voxels.voxelAtPosition(posxyz);
        if (ex) true;
        voxels.voxelAtPosition(posxyz, value);
        var c = voxels.chunkAtPosition(posxyz);
        var key = c.join('|');
        if (!updated[key] && voxels.chunks[key]) {
            updated[key] = voxels.chunks[key];
        }
    }
    
    function flush() {
        Object.keys(updated).forEach(function (key) {
            game.showChunk(updated[key]);
        });
    }
    return this;
};

function randomChunk (bounds) {
    var x = Math.random() * (bounds.x.max - bounds.x.min) + bounds.x.min;
    var y = Math.random() * (bounds.y.max - bounds.y.min) + bounds.y.min;
    var z = Math.random() * (bounds.z.max - bounds.z.min) + bounds.z.min;
    return [ x, y, z ].map(Math.floor).join('|');
};

function boundingChunks (chunks) {
    return Object.keys(chunks).reduce(function (acc, key) {
        var s = key.split('|');
        if (acc.x.min === undefined) acc.x.min = s[0]
        if (acc.x.max === undefined) acc.x.max = s[0]
        if (acc.y.min === undefined) acc.y.min = s[1]
        if (acc.y.max === undefined) acc.y.max = s[1]
        if (acc.z.min === undefined) acc.z.min = s[2]
        if (acc.z.max === undefined) acc.z.max = s[2]
        
        acc.x.min = Math.min(acc.x.min, s[0]);
        acc.x.max = Math.max(acc.x.max, s[0]);
        acc.y.min = Math.min(acc.y.min, s[1]);
        acc.y.max = Math.max(acc.y.max, s[1]);
        acc.z.min = Math.min(acc.z.min, s[2]);
        acc.z.max = Math.max(acc.z.max, s[2]);
        
        return acc;
    }, {
        x: {}, 
        y: {}, 
        z: {}
    });
};

