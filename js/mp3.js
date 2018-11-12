//----------------------------------------------------------------------------------
/**
 * Draw call that applies matrix transformations to model and draws model in frame
 */
function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // We'll use perspective
  mat4.perspective(pMatrix,degToRad(45),
                   gl.viewportWidth / gl.viewportHeight,
                   0.1, 500.0);

  // We want to look down -z, so create a lookat point in that direction
  vec3.add(viewPt, eyePt, viewDir);

  // Then generate the lookat matrix and initialize the view matrix to that view
  mat4.lookAt(vMatrix,eyePt,viewPt,up);

  // Prevent early drawing of myMesh or cubemap
  if (myMesh.loaded() && (texturesLoaded == 6)) {
    // Push values so that things don't rotate every draw unless keyboard is modifying values
    mvPushMatrix();
    pushLightPosition();

    // Apply rotations
    mat4.rotateY(mvMatrix, mvMatrix, degToRad(eulerY));
    vec3.rotateY(lightPosition, lightPosition, vec3.fromValues(0,0,0), degToRad(eulerY));
    mat4.multiply(mvMatrix,vMatrix,mvMatrix);

    // Draw mesh
    gl.useProgram(shaderProgramMesh);

    setMatrixUniforms(shaderProgramMesh);
    setLightUniforms(shaderProgramMesh,lightPosition,lAmbient,lDiffuse,lSpecular);
    setMaterialUniforms(shaderProgramMesh,shininess,kAmbient,kTerrainDiffuse,kSpecular);

    myMesh.drawTriangles();

    // Draw cube
    gl.useProgram(shaderProgramCube);

    setMatrixUniforms(shaderProgramCube);
    setLightUniforms(shaderProgramCube,lightPosition,lAmbient,lDiffuse,lSpecular);
    setMaterialUniforms(shaderProgramCube,shininess,kAmbient,kTerrainDiffuse,kSpecular);

    drawCube();

    // Pop values so that things don't rotate every draw unless keyboard is modifying values
    mvPopMatrix();
    popLightPosition();
  }
}

//----------------------------------------------------------------------------------
/**
 * Startup function called from html code to start program.
 */
 function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShadersMesh();
  setupShadersCube();
  setupBuffers();
  setupTextures();
  setupMesh("obj/teapot.obj");
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
  tick();
}

//----------------------------------------------------------------------------------
/**
 * Code to handle user interaction
 */
var currentlyPressedKeys = {};

function handleKeyDown(event) {
  //console.log("Key down ", event.key, " code ", event.code);
  currentlyPressedKeys[event.key] = true;
  if (currentlyPressedKeys["a"]) {
    // key A
    eulerY += 1;
  } else if (currentlyPressedKeys["d"]) {
    // key D
    eulerY -= 1;
  }

  if (currentlyPressedKeys["ArrowUp"]){
    // Up cursor key
    event.preventDefault();
    eyePt[2] -= 0.1;
  } else if (currentlyPressedKeys["ArrowDown"]){
    event.preventDefault();
    // Down cursor key
    eyePt[2] += 0.1;
  }
}

function handleKeyUp(event) {
  //console.log("Key up ", event.key, " code ", event.code);
  currentlyPressedKeys[event.key] = false;
}

//----------------------------------------------------------------------------------
/**
  * Update any model transformations
  */
function animate() {
  //console.log(eulerX, " ", eulerY, " ", eulerZ);
  days=days+0.5;
  document.getElementById("eY").value=eulerY;
  document.getElementById("eZ").value=eyePt[2];
}

//----------------------------------------------------------------------------------
/**
 * Keeping drawing frames....
 */
function tick() {
  requestAnimFrame(tick);
  animate();
  draw();
}
