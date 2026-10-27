Vector = function() {};

Vector.create = function(x,y) {
    var V = new Vector();
    return V.create(x,y);
};

var $V = Vector.create;

Vector.prototype = {
    create: function(x,y) {
        this.x = x;
        this.y = y;
        return this;
    },

    add: function(vector) {
        var V = vector;
        this.x += V.x;
        this.y += V.y;
        return this;
    },

    subtract: function(vector) {
        var V = vector;
        this.x -= V.x;
        this.y -= V.y;
        return this;
    },

    multiply: function(k) {
        this.x *= k;
        this.y *= k;
        return this;
    },

    scalarProduct: function(vector) {
        var V = vector;
        return this.x * V.x + this.y * V.y;
    },

    distanceFrom: function(vector) {
        var V = vector;
        var sum = 0;

        var xd = this.x - V.x;
        var yd = this.y - V.y;

        sum += xd * xd;
        sum += yd * yd;

        return Math.sqrt(sum);
    },

    vectorTo: function(vector)
    {
        var V = vector;
        var x = V.x - this.x;
        var y = V.y - this.y;
        return Vector.create(x, y);
    },

    unitVector: function()
    {
        return Vector.create(this.x/this.abs(), this.y/this.abs());
    },

    abs: function()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
};