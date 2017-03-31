function Sun(distFromOrigin) {
	// The light the scene will get at day time
	this.daylight = new Material(
		vec4(0.3, 0.3, 0.3, 1.0),
		vec4(0.7, 0.7, 0.7, 1.0)
	);
    
	this.darkness = new Material(
		vec4(0.2, 0.2, 0.2, 1.0),
		vec4(0.0, 0.0, 0.0, 1.0)
	);
    
	// The material the glHelper will use for calculating light products
	this.lightMaterial = this.daylight;

	this.angle = 10;      // Stores the time of day
	this.distFromOrigin = distFromOrigin;

	this.daySky     = vec4(0.54, 0.81, 0.94, 1.0);
	this.skyColor = this.daySky;

	this.sun = new Sphere(new Material(vec4(1.0, 1.0, 0.0, 1.0), vec4(1.0, 1.0, 0.0, 1.0)), null, true, null);
	this.sun.radius = 15;
}

Sun.prototype.draw = function(dt) {
    this.angle = 90; // Sun directly overhead
    this.sun.position = vec3(this.distFromOrigin, 0.0, 0.0);

	var rad = radians(this.angle);
	var sin = Math.sin(rad);
	var cos = Math.cos(rad);
	var posCos = this.distFromOrigin * cos;
	var posSin = this.distFromOrigin * sin;

	var lightAlpha = Math.abs(sin); // Amount of light (from day to night) that the scene gets
	var envLight = this.daylight;
	var oldLight = this.lightMaterial;

	glHelper.setLightPosition(vec3(posCos, posSin, 0));

	this.lightMaterial = this.daylight;
	glHelper.setLightMaterial(this.lightMaterial);
    
    this.sun.draw(dt, rotate(this.angle, vec3(0, 0, 1)));

	// Restore the light material for the rest of the scene
	this.lightMaterial = oldLight;
    
    // Default day sky
    this.skyColor = this.daySky;

	this.lightMaterial = new Material(
		mix(envLight.ambient, this.darkness.ambient, lightAlpha),
		mix(envLight.diffuse, this.darkness.diffuse, lightAlpha)
	);
	glHelper.setLightMaterial(this.lightMaterial);
}
