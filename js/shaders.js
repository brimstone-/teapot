//----------------------------------------------------------------------------------
/**
 * Loads Shaders
 * @param {string} id ID string for shader to load. Either vertex shader/fragment shader
 */
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);

  // If we don't find an element with the specified id
  // we do an early exit
  if (!shaderScript) {
    return null;
  }

  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

//----------------------------------------------------------------------------------
/**
 * Setup the shaderes
 */
function setupShaders() {
  setupShadersMesh();
  setupShadersCube();
  setupShadersReflection();
}

//----------------------------------------------------------------------------------
/**
 * Setup the fragment and vertex shaders for the mesh model
 */
function setupShadersMesh() {
  vertexShader = loadShaderFromDOM("shader-vs-mesh");
  fragmentShader = loadShaderFromDOM("shader-fs-mesh");

  shaderProgramMesh = gl.createProgram();
  gl.attachShader(shaderProgramMesh, vertexShader);
  gl.attachShader(shaderProgramMesh, fragmentShader);
  gl.linkProgram(shaderProgramMesh);

  if (!gl.getProgramParameter(shaderProgramMesh, gl.LINK_STATUS)) {
    alert("Failed to setup mesh shaders");
  }

  gl.useProgram(shaderProgramMesh);

  shaderProgramMesh.vertexPositionAttribute = gl.getAttribLocation(shaderProgramMesh, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgramMesh.vertexPositionAttribute);

  shaderProgramMesh.vertexNormalAttribute = gl.getAttribLocation(shaderProgramMesh, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgramMesh.vertexNormalAttribute);

  shaderProgramMesh.mvMatrixUniform = gl.getUniformLocation(shaderProgramMesh, "uMVMatrix");
  shaderProgramMesh.pMatrixUniform = gl.getUniformLocation(shaderProgramMesh, "uPMatrix");
  shaderProgramMesh.nMatrixUniform = gl.getUniformLocation(shaderProgramMesh, "uNMatrix");
  shaderProgramMesh.uniformLightPositionLoc = gl.getUniformLocation(shaderProgramMesh, "uLightPosition");
  shaderProgramMesh.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgramMesh, "uAmbientLightColor");
  shaderProgramMesh.uniformDiffuseLightColorLoc = gl.getUniformLocation(shaderProgramMesh, "uDiffuseLightColor");
  shaderProgramMesh.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgramMesh, "uSpecularLightColor");
  shaderProgramMesh.uniformShininessLoc = gl.getUniformLocation(shaderProgramMesh, "uShininess");
  shaderProgramMesh.uniformAmbientMaterialColorLoc = gl.getUniformLocation(shaderProgramMesh, "uKAmbient");
  shaderProgramMesh.uniformDiffuseMaterialColorLoc = gl.getUniformLocation(shaderProgramMesh, "uKDiffuse");
  shaderProgramMesh.uniformSpecularMaterialColorLoc = gl.getUniformLocation(shaderProgramMesh, "uKSpecular");

  console.log("Mesh shaders succesfully set up.");
}

//----------------------------------------------------------------------------------
/**
 * Setup the fragment and vertex shaders for the cubemap
 */
function setupShadersCube() {
  vertexShader = loadShaderFromDOM("shader-vs-cube");
  fragmentShader = loadShaderFromDOM("shader-fs-cube");
  
  shaderProgramCube = gl.createProgram();
  gl.attachShader(shaderProgramCube, vertexShader);
  gl.attachShader(shaderProgramCube, fragmentShader);
  gl.linkProgram(shaderProgramCube);

  if (!gl.getProgramParameter(shaderProgramCube, gl.LINK_STATUS)) {
    alert("Failed to cube setup shaders");
  }

  gl.useProgram(shaderProgramCube);

  shaderProgramCube.vertexPositionAttribute = gl.getAttribLocation(shaderProgramCube, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgramCube.vertexPositionAttribute);

  shaderProgramCube.vertexNormalAttribute = gl.getAttribLocation(shaderProgramCube, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgramCube.vertexNormalAttribute);

  shaderProgramCube.mvMatrixUniform = gl.getUniformLocation(shaderProgramCube, "uMVMatrix");
  shaderProgramCube.pMatrixUniform = gl.getUniformLocation(shaderProgramCube, "uPMatrix");
  shaderProgramCube.nMatrixUniform = gl.getUniformLocation(shaderProgramCube, "uNMatrix");

  console.log("Cube shaders succesfully set up.");
}

//----------------------------------------------------------------------------------
/**
 * Setup the fragment and vertex shaders for the cube with reflection
 */
function setupShadersReflection() {
  vertexShader = loadShaderFromDOM("reflection-vs");
  fragmentShader = loadShaderFromDOM("reflection-fs");

  shaderProgramReflection = gl.createProgram();
  gl.attachShader(shaderProgramReflection, vertexShader);
  gl.attachShader(shaderProgramReflection, fragmentShader);
  gl.linkProgram(shaderProgramReflection);

  if (!gl.getProgramParameter(shaderProgramReflection, gl.LINK_STATUS)) {
    alert("Failed to setup reflection shaders");
  }

  gl.useProgram(shaderProgramReflection);

  shaderProgramReflection.vertexPositionAttribute = gl.getAttribLocation(shaderProgramReflection, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgramReflection.vertexPositionAttribute);

  shaderProgramReflection.vertexNormalAttribute = gl.getAttribLocation(shaderProgramReflection, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgramReflection.vertexNormalAttribute);

  shaderProgramReflection.mvMatrixUniform = gl.getUniformLocation(shaderProgramReflection, "uMVMatrix");

  shaderProgramReflection.mvMatrixInverseUniform = gl.getUniformLocation(shaderProgramReflection, "uMVMatrixInverse");
  shaderProgramReflection.nMatrixInverseUniform = gl.getUniformLocation(shaderProgramReflection, "uNMatrixInverse");
  shaderProgramReflection.vMatrixInverseUniform = gl.getUniformLocation(shaderProgramReflection, "uVMatrixInverse");

  shaderProgramReflection.pMatrixUniform = gl.getUniformLocation(shaderProgramReflection, "uPMatrix");
  shaderProgramReflection.nMatrixUniform = gl.getUniformLocation(shaderProgramReflection, "uNMatrix");
  shaderProgramReflection.uniformLightPositionLoc = gl.getUniformLocation(shaderProgramReflection, "uLightPosition");
  shaderProgramReflection.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgramReflection, "uAmbientLightColor");
  shaderProgramReflection.uniformDiffuseLightColorLoc = gl.getUniformLocation(shaderProgramReflection, "uDiffuseLightColor");
  shaderProgramReflection.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgramReflection, "uSpecularLightColor");
  shaderProgramReflection.uniformShininessLoc = gl.getUniformLocation(shaderProgramReflection, "uShininess");
  shaderProgramReflection.uniformAmbientMaterialColorLoc = gl.getUniformLocation(shaderProgramReflection, "uKAmbient");
  shaderProgramReflection.uniformDiffuseMaterialColorLoc = gl.getUniformLocation(shaderProgramReflection, "uKDiffuse");
  shaderProgramReflection.uniformSpecularMaterialColorLoc = gl.getUniformLocation(shaderProgramReflection, "uKSpecular");

  console.log("Reflection shaders succesfully set up.");
}
