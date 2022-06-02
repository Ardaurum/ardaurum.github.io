import * as THREE from '../vendor/three.min.js'

var WebGLRenderer = {
	clock: {},
	gfxContexts: [],

	init: function () {
		const views = document.getElementsByClassName("shader-view");
		this.clock = new THREE.Clock();

		for (const view of views) {
			gfxContext = {};
			gfxContext.view = view;
			gfxContext.camera = new THREE.PerspectiveCamera(75, view.offsetWidth / view.offsetHeight, 0.1,
				1000);
			gfxContext.camera.position.z = 1;
			gfxContext.scene = new THREE.Scene();
			gfxContext.renderer = new THREE.WebGLRenderer();
			gfxContext.renderer.setSize(view.offsetWidth, view.offsetHeight);
			gfxContext.renderer.setPixelRatio(window.devicePixelRatio);

			gfxContext.uniforms = {
				u_time: {
					type: "f",
					value: 1.0
				},
				u_resolution: {
					type: "v2",
					value: new THREE.Vector2()
				}
			};

			let material = new THREE.ShaderMaterial({
				uniforms: gfxContext.uniforms,
				vertexShader: document.getElementById("full-screen-triangle").textContent,
				fragmentShader: document.getElementById(view.getAttribute("fragment-src")).textContent
			});

			const geometry = new THREE.BufferGeometry();
			geometry.setIndex([0, 1, 2]);
			geometry.setAttribute('id', new THREE.BufferAttribute(new Int32Array([0, 1, 2]), 1));
			const mesh = new THREE.Mesh(geometry, material);
			mesh.frustumCulled = false;
			gfxContext.scene.add(mesh);

			this.gfxContexts.push(gfxContext);
			view.appendChild(gfxContext.renderer.domElement);
		}

		this.onWindowResize();
		window.addEventListener('resize', this.onWindowResize, false);
	},

	onWindowResize: function (event) {
		for (const gfxContext of WebGLRenderer.gfxContexts) {
			gfxContext.renderer.setSize(gfxContext.view.offsetWidth, gfxContext.view.offsetHeight);
			gfxContext.uniforms.u_resolution.value.x = gfxContext.renderer.domElement.width;
			gfxContext.uniforms.u_resolution.value.y = gfxContext.renderer.domElement.height;
		}
	},

	animate: function () {
		requestAnimationFrame(() => this.animate());
		this.render();
	},

	render: function () {
		for (const gfxContext of this.gfxContexts) {
			gfxContext.uniforms.u_time.value += this.clock.getDelta();
			gfxContext.renderer.render(gfxContext.scene, gfxContext.camera);
		}
	}
}

WebGLRenderer.init();
WebGLRenderer.animate();