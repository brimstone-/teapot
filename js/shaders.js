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

function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs-cube");
  fragmentShader = loadShaderFromDOM("shader-fs-cube");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
  shaderProgram.uniformLightPositionLoc = gl.getUniformLocation(shaderProgram, "uLightPosition");
  shaderProgram.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgram, "uAmbientLightColor");
  shaderProgram.uniformDiffuseLightColorLoc = gl.getUniformLocation(shaderProgram, "uDiffuseLightColor");
  shaderProgram.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgram, "uSpecularLightColor");
  shaderProgram.uniformShininessLoc = gl.getUniformLocation(shaderProgram, "uShininess");
  shaderProgram.uniformAmbientMaterialColorLoc = gl.getUniformLocation(shaderProgram, "uKAmbient");
  shaderProgram.uniformDiffuseMaterialColorLoc = gl.getUniformLocation(shaderProgram, "uKDiffuse");
  shaderProgram.uniformSpecularMaterialColorLoc = gl.getUniformLocation(shaderProgram, "uKSpecular");

  console.log("Shaders succesfully set up.");
}

//----------------------------------------------------------------------------------
/**
 * Setup the fragment and vertex shaders
 */
// function setupShaders_Cube() {
//   vertexShader = loadShaderFromDOM("shader-vs-cube");
//   fragmentShader = loadShaderFromDOM("shader-fs-cube");
  
//   shaderProgramCube = gl.createProgram();
//   gl.attachShader(shaderProgramCube, vertexShader);
//   gl.attachShader(shaderProgramCube, fragmentShader);
//   gl.linkProgram(shaderProgramCube);

//   if (!gl.getProgramParameter(shaderProgramCube, gl.LINK_STATUS)) {
//     alert("Failed to setup shaders");
//   }

//   gl.useProgram(shaderProgramCube);

//   shaderProgramCube.vertexPositionAttribute = gl.getAttribLocation(shaderProgramCube, "aVertexPosition");
//   gl.enableVertexAttribArray(shaderProgramCube.vertexPositionAttribute);

//   shaderProgramCube.vertexNormalAttribute = gl.getAttribLocation(shaderProgramCube, "aVertexNormal");
//   gl.enableVertexAttribArray(shaderProgramCube.vertexNormalAttribute);

//   shaderProgramCube.mvMatrixUniform = gl.getUniformLocation(shaderProgramCube, "uMVMatrix");
//   shaderProgramCube.pMatrixUniform = gl.getUniformLocation(shaderProgramCube, "uPMatrix");
//   shaderProgramCube.nMatrixUniform = gl.getUniformLocation(shaderProgramCube, "uNMatrix");
 
// }
