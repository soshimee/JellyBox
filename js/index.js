let display;

const url = new URL(location);

function setParamIfNotHas(id, value) {
	if (!url.searchParams.has(id)) url.searchParams.set(id, value);
}

function getParamAsFloat(id) {
	return parseFloat(url.searchParams.get(id));
}

function setInputValue(id) {
	document.querySelector("." + id).value = getParamAsFloat(id);
}

function setParamAsInputValue(id) {
	url.searchParams.set(id, document.querySelector("." + id).value);
}

setParamIfNotHas("gravity_x", 0);
setParamIfNotHas("gravity_y", 1);
setParamIfNotHas("boundary_friction", 0.6);
setParamIfNotHas("collision_damping", 0.7);
setParamIfNotHas("collision_force", 400);
setParamIfNotHas("mouse_pull", 0.0025);
setParamIfNotHas("damp", 0.3);
setParamIfNotHas("stiff", 0.06);
setParamIfNotHas("mass", 1);
setParamIfNotHas("count", 5);
setParamIfNotHas("size", 100);
setParamIfNotHas("resolution", 20);
setParamIfNotHas("count", 5);
setParamIfNotHas("size", 100);
setParamIfNotHas("resolution", 20);

if (new URL(location).toString() != url.toString()) location.replace(url.toString());

setInputValue("gravity_x");
setInputValue("gravity_y");
setInputValue("boundary_friction");
setInputValue("collision_damping");
setInputValue("collision_force");
setInputValue("mouse_pull");
setInputValue("damp");
setInputValue("stiff");
setInputValue("mass");
setInputValue("count");
setInputValue("size");
setInputValue("resolution");

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);

	const gravity = createVector(getParamAsFloat("gravity_x"), getParamAsFloat("gravity_y"));
	const boundary_friction = getParamAsFloat("boundary_friction");
	const collison_damping = getParamAsFloat("collision_damping");
	const collision_force = getParamAsFloat("collision_force");
	const mouse_pull = getParamAsFloat("mouse_pull");
	const damp = getParamAsFloat("damp");
	const stiff = getParamAsFloat("stiff");
	const mass = getParamAsFloat("mass");

	const count = getParamAsFloat("count");
	const size = getParamAsFloat("size");
	const resolution = getParamAsFloat("resolution");

	const softbodies = new Array(count);

	for (let i = 0; i < count; i++) {
		const p = i / (count - 1);
		const pos = createVector(lerp(size, width - size, p), size);

		let col = lerpColor(color("red"), color("blue"), p);
		col = lerpColor(col, color("white"), 0.6);

		const rot = random(TWO_PI);
		const body = create_square(damp, mass, stiff, resolution, size, pos, rot, col);
		softbodies[i] = body;
	}

	const mouse_force = softbody => {
		if (mouseIsPressed) {
			let force_vector = createVector(mouseX, mouseY).sub(softbody.position);
			force_vector.mult(mouse_pull);
			softbody.external_force.add(force_vector);
		}
	}

	const gravity_force = (softbody) => {
		softbody.external_force.add(gravity);
	}

	const forces = [mouse_force, gravity_force];
	display = new scene(softbodies, boundary_friction,
		collison_damping, collision_force, forces)
}

function draw() {
	background(255)
	fill(150, 0, 100, 255 - frameCount);

	resizeCanvas(window.innerWidth, window.innerHeight);
	display.update();
}

function create_square(damping, mass, stiffness, node_count,
	size, position, rotation, color) {

	let nodes = new Array(node_count);
	for (let i = 0; i < nodes.length; i++) {
		let springs = [];
		for (let j = 0; j < nodes.length; j++) {
			if (i != j) {
				springs.push(new spring(0, stiffness, j));
			}
		}

		let normal = createVector(size / 2, 0);
		let scalar = 4 * i / nodes.length;
		let y = (scalar % 1) * size - size / 2;
		let side = HALF_PI * int(scalar % 4);
		let p = p5.Vector.add(normal, createVector(0, y)).rotate(side + rotation);
		p.add(position);

		nodes[i] = new node(p, mass, damping, springs);
	}

	for (let i = 0; i < nodes.length; i++) {
		current_node = nodes[i];
		let springs = current_node.springs;
		for (let j = 0; j < springs.length; j++) {
			current_spring = springs[j];
			d = current_node.position.dist(nodes[current_spring.index].position);
			current_spring.length = d;
			current_spring.stiffness /= d;
			current_spring.stiffness *= sqrt(2) * size;
		}
	}

	return new softbody(nodes, color);
}

let fullscreen = false;

document.querySelector(".fullscreen").onclick = () => {
	if (!fullscreen) document.documentElement.requestFullscreen(), fullscreen = true;
	else document.exitFullscreen(), fullscreen = false;
}

document.querySelector(".apply").onclick = () => {
	setParamAsInputValue("gravity_x");
	setParamAsInputValue("gravity_y");
	setParamAsInputValue("boundary_friction");
	setParamAsInputValue("collision_damping");
	setParamAsInputValue("collision_force");
	setParamAsInputValue("mouse_pull");
	setParamAsInputValue("damp");
	setParamAsInputValue("stiff");
	setParamAsInputValue("mass");
	setParamAsInputValue("count");
	setParamAsInputValue("size");
	setParamAsInputValue("resolution");
	location.replace(url.toString());
}

document.querySelector(".reset").onclick = () => {
	url.searchParams.forEach((_value, key) => {
		url.searchParams.delete(key);
	})
	location.replace(url.toString());
}