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
  //vec3.add(viewPt, eyePt, viewDir);

  // View Rotation
  pushEyePosition();
  pushUp();

  var viewQuat = quat.create();
  quat.fromEuler(viewQuat, -eulerX, -eulerY, 0.0);
  vec3.transformQuat(eyePt,eyePt,viewQuat);
  vec3.transformQuat(up,up,viewQuat);

  // Then generate the lookat matrix and initialize the view matrix to that view
  mat4.lookAt(vMatrix,eyePt,viewPt,up);

  popEyePosition();
  popUp();

  // Prevent early drawing of myMesh or cubemap
  if (myMesh.loaded() && (texturesLoaded == 6)) {
    // Push values so that things don't rotate every draw unless keyboard is modifying values
    mvPushMatrix();
    pushLightPosition();

    // Apply rotations to light and mvMatrix
    vec3.rotateY(lightPosition, lightPosition, vec3.fromValues(0,0,0), degToRad(eulerY));

    mat4.multiply(mvMatrix,vMatrix,mvMatrix);

    // Draw cube
    gl.useProgram(shaderProgramCube);

    setMatrixUniforms(shaderProgramCube);
    setLightUniforms(shaderProgramCube,lightPosition,lAmbient,lDiffuse,lSpecular);
    setMaterialUniforms(shaderProgramCube,shininess,kAmbient,kTerrainDiffuse,kSpecular);

    drawCube();

    // Teapot Rotation
    var modelQuat = quat.create();
    var transformMatrix = mat4.create();
    quat.fromEuler(modelQuat, -rotX, -rotY, 0.0);
    mat4.fromQuat(transformMatrix, modelQuat);
    mat4.multiply(mvMatrix, mvMatrix, transformMatrix);

    // Draw mesh
    if(document.getElementById("reflect-off").checked) {
      gl.useProgram(shaderProgramMesh);

      setMatrixUniforms(shaderProgramMesh);
      setLightUniforms(shaderProgramMesh,lightPosition,lAmbient,lDiffuse,lSpecular);
      setMaterialUniforms(shaderProgramMesh,shininess,kAmbient,kTerrainDiffuse,kSpecular);

      myMesh.drawTriangles();
    }

    if(document.getElementById("reflect-on").checked) {
      gl.useProgram(shaderProgramReflection);

      setMatrixUniforms(shaderProgramReflection);
      setLightUniforms(shaderProgramReflection,lightPosition,lAmbient,lDiffuse,lSpecular);
      setMaterialUniforms(shaderProgramReflection,shininess,kAmbient,kTerrainDiffuse,kSpecular);

      myMesh.drawTriangles();
    }

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
  setupShaders();
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

  if (currentlyPressedKeys["w"]) {
    // key W
    eulerX += 1;
  } else if (currentlyPressedKeys["s"]) {
    // key S
    eulerX -= 1;
  }

  if (currentlyPressedKeys["a"]) {
    // key A
    eulerY += 1;
  } else if (currentlyPressedKeys["d"]) {
    // key D
    eulerY -= 1;
  }

  if (currentlyPressedKeys["ArrowUp"]) {
    // Up cursor key
    event.preventDefault();
    rotX += 1;
  } else if (currentlyPressedKeys["ArrowDown"]) {
    event.preventDefault();
    // Down cursor key
    rotX -= 1;
  }

  if (currentlyPressedKeys["ArrowRight"]) {
    // Right cursor key
    event.preventDefault();
    rotY += 1;
  } else if (currentlyPressedKeys["ArrowLeft"]) {
    // Left cursor key
    event.preventDefault();
    rotY -= 1;
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
  document.getElementById("eX").value=eulerX;
  document.getElementById("eY").value=eulerY;

  document.getElementById("rX").value=rotX;
  document.getElementById("rY").value=rotY;
  //document.getElementById("eZ").value=eyePt[2];
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
