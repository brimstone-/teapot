//----------------------------------------------------------------------------------
/**
 * Creates a context for WebGL
 * @param {element} canvas WebGL canvas
 * @return {Object} WebGL context
 */
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

//----------------------------------------------------------------------------------
/**
 * Translates degrees to radians
 * @param {Number} degrees Degree input to function
 * @return {Number} The radians that correspond to the degree input
 */
function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

//---------------------------------------------------------------------------------
/**
 * @param {number} value Value to determine whether it is a power of 2
 * @return {boolean} Boolean of whether value is a power of 2
 */
function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

//-------------------------------------------------------------------------
/**
 * Sends Modelview matrix to shader
 */
function uploadModelViewMatrixToShaderCube() {
  gl.uniformMatrix4fv(shaderProgramCube.mvMatrixUniform, false, mvMatrix);
}

function uploadModelViewMatrixToShaderMesh() {
  gl.uniformMatrix4fv(shaderProgramMesh.mvMatrixUniform, false, mvMatrix);
}

//-------------------------------------------------------------------------
/**
 * Sends projection matrix to shader
 */
function uploadProjectionMatrixToShaderCube() {
  gl.uniformMatrix4fv(shaderProgramCube.pMatrixUniform, false, pMatrix);
}

function uploadProjectionMatrixToShaderMesh() {
  gl.uniformMatrix4fv(shaderProgramMesh.pMatrixUniform, false, pMatrix);
}

//-------------------------------------------------------------------------
/**
 * Generates and sends the normal matrix to the shader
 */
function uploadNormalMatrixToShaderMesh() {
  mat3.fromMat4(nMatrix,mvMatrix);
  mat3.transpose(nMatrix,nMatrix);
  mat3.invert(nMatrix,nMatrix);
  gl.uniformMatrix3fv(shaderProgramMesh.nMatrixUniform, false, nMatrix);
}

function uploadNormalMatrixToShaderCube() {
  mat3.fromMat4(nMatrix,mvMatrix);
  mat3.transpose(nMatrix,nMatrix);
  mat3.invert(nMatrix,nMatrix);
  gl.uniformMatrix3fv(shaderProgramCube.nMatrixUniform, false, nMatrix);
}

//----------------------------------------------------------------------------------
/**
 * Pushes matrix onto modelview matrix stack
 */
function mvPushMatrix() {
  var copy = mat4.clone(mvMatrix);
  mvMatrixStack.push(copy);
}


//----------------------------------------------------------------------------------
/**
 * Pops matrix off of modelview matrix stack
 */
function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

//----------------------------------------------------------------------------------
/**
 * Sends projection/modelview matrices to shader
 */
function setMatrixUniformsCube() {
  uploadModelViewMatrixToShaderCube();
  uploadNormalMatrixToShaderCube();
  uploadProjectionMatrixToShaderCube();
}

function setMatrixUniformsMesh() {
  uploadModelViewMatrixToShaderMesh();
  uploadNormalMatrixToShaderMesh();
  uploadProjectionMatrixToShaderMesh();
}

//-------------------------------------------------------------------------
/**
 * Sends material information to the shader
 * @param {Float32} alpha shininess coefficient
 * @param {Float32Array} a Ambient material color
 * @param {Float32Array} d Diffuse material color
 * @param {Float32Array} s Specular material color
 */
function setMaterialUniformsCube(alpha,a,d,s) {
  gl.uniform1f(shaderProgramCube.uniformShininessLoc, alpha);
  gl.uniform3fv(shaderProgramCube.uniformAmbientMaterialColorLoc, a);
  gl.uniform3fv(shaderProgramCube.uniformDiffuseMaterialColorLoc, d);
  gl.uniform3fv(shaderProgramCube.uniformSpecularMaterialColorLoc, s);
}

function setMaterialUniformsMesh(alpha,a,d,s) {
  gl.uniform1f(shaderProgramMesh.uniformShininessLoc, alpha);
  gl.uniform3fv(shaderProgramMesh.uniformAmbientMaterialColorLoc, a);
  gl.uniform3fv(shaderProgramMesh.uniformDiffuseMaterialColorLoc, d);
  gl.uniform3fv(shaderProgramMesh.uniformSpecularMaterialColorLoc, s);
}

//-------------------------------------------------------------------------
/**
 * Sends light information to the shader
 * @param {Float32Array} loc Location of light source
 * @param {Float32Array} a Ambient light strength
 * @param {Float32Array} d Diffuse light strength
 * @param {Float32Array} s Specular light strength
 */
function setLightUniformsCube(loc,a,d,s) {
  gl.uniform3fv(shaderProgramCube.uniformLightPositionLoc, loc);
  gl.uniform3fv(shaderProgramCube.uniformAmbientLightColorLoc, a);
  gl.uniform3fv(shaderProgramCube.uniformDiffuseLightColorLoc, d);
  gl.uniform3fv(shaderProgramCube.uniformSpecularLightColorLoc, s);
}

function setLightUniformsMesh(loc,a,d,s) {
  gl.uniform3fv(shaderProgramMesh.uniformLightPositionLoc, loc);
  gl.uniform3fv(shaderProgramMesh.uniformAmbientLightColorLoc, a);
  gl.uniform3fv(shaderProgramMesh.uniformDiffuseLightColorLoc, d);
  gl.uniform3fv(shaderProgramMesh.uniformSpecularLightColorLoc, s);
}
