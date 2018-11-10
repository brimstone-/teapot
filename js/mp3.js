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

  //Draw
  //ADD an if statement to prevent early drawing of myMesh or cubemap
  if (myMesh.loaded() && (texturesLoaded == 6)) {
    mvPushMatrix();
    mat4.rotateY(mvMatrix, mvMatrix, degToRad(eulerY));
    mat4.multiply(mvMatrix,vMatrix,mvMatrix);

    // setupShaders_Mesh();
    gl.useProgram(shaderProgramMesh);

    setMatrixUniformsMesh();
    setLightUniformsMesh(lightPosition,lAmbient,lDiffuse,lSpecular);
    setMaterialUniformsMesh(shininess,kAmbient,kTerrainDiffuse,kSpecular);

    myMesh.drawTriangles();

    // setupShaders_Cube();
    gl.useProgram(shaderProgramCube);

    setMatrixUniformsCube();
    setLightUniformsCube(lightPosition,lAmbient,lDiffuse,lSpecular);
    setMaterialUniformsCube(shininess,kAmbient,kTerrainDiffuse,kSpecular);

    drawCube();

    mvPopMatrix();
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
  //setupShaders();
  setupBuffers();
  setupTextures();
  //setupMesh("obj/cow.obj");
  setupMesh("obj/teapot.obj");
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
  tick();
}

//----------------------------------------------------------------------------------
//Code to handle user interaction
var currentlyPressedKeys = {};

function handleKeyDown(event) {
  //console.log("Key down ", event.key, " code ", event.code);
  currentlyPressedKeys[event.key] = true;
  if (currentlyPressedKeys["a"]) {
    // key A
    eulerY+= 1;
  } else if (currentlyPressedKeys["d"]) {
    // key D
    eulerY-= 1;
  }

  if (currentlyPressedKeys["ArrowUp"]){
    // Up cursor key
    event.preventDefault();
    eyePt[2]-= 0.1;
  } else if (currentlyPressedKeys["ArrowDown"]){
    event.preventDefault();
    // Down cursor key
    eyePt[2]+= 0.1;
  }
}

function handleKeyUp(event) {
  //console.log("Key up ", event.key, " code ", event.code);
  currentlyPressedKeys[event.key] = false;
}

//-------------------------------------------------------------------------
/**
 * Update the rotation variable when a key is pressed.
 * @param {Event} event Specifies which key is being pressed
 */
// function handleKeyDown(event) {
//     event.preventDefault();

//     if (event["key"] == "ArrowLeft") {
//         yAngle -= 0.03;
//     } else if (event["key"] == "ArrowRight") {
//         yAngle += 0.03;
//     }
//     // else if (event["key"] == "ArrowUp") {
//     //     xAngle -= 0.03;
//     // } else if (event ["key"] == "ArrowDown") {
//     //     xAngle += 0.03;
//     // }
// }

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
