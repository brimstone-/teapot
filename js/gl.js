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
function uploadModelViewMatrixToShader(targetShader) {
  gl.uniformMatrix4fv(targetShader.mvMatrixUniform, false, mvMatrix);
}

//-------------------------------------------------------------------------
/**
 * Sends projection matrix to shader
 */
function uploadProjectionMatrixToShader(targetShader) {
  gl.uniformMatrix4fv(targetShader.pMatrixUniform, false, pMatrix);
}

//-------------------------------------------------------------------------
/**
 * Generates and sends the normal matrix to the shader
 */
function uploadNormalMatrixToShader(targetShader) {
  mat3.fromMat4(nMatrix,mvMatrix);
  mat3.transpose(nMatrix,nMatrix);
  mat3.invert(nMatrix,nMatrix);
  gl.uniformMatrix3fv(targetShader.nMatrixUniform, false, nMatrix);
}

//----------------------------------------------------------------------------------
/**
 * Pushes matrix or lightPosition onto respective stack
 */
function mvPushMatrix() {
  var copy = mat4.clone(mvMatrix);
  mvMatrixStack.push(copy);
}

function pushLightPosition() {
  var copy = vec3.clone(lightPosition);
  lightPositionStack.push(copy);
}


//----------------------------------------------------------------------------------
/**
 * Pops matrix or lightPosition onto respective stack
 */
function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

function popLightPosition() {
  if (lightPositionStack.length == 0) {
    throw "Invalid popLightPosition!";
  }
  lightPosition = lightPositionStack.pop();
}

//----------------------------------------------------------------------------------
/**
 * Sends projection/modelview matrices to shader
 */
function setMatrixUniforms(targetShader) {
  uploadModelViewMatrixToShader(targetShader);
  uploadNormalMatrixToShader(targetShader);
  uploadProjectionMatrixToShader(targetShader);
}

//-------------------------------------------------------------------------
/**
 * Sends material information to the shader
 * @param {Float32} alpha shininess coefficient
 * @param {Float32Array} a Ambient material color
 * @param {Float32Array} d Diffuse material color
 * @param {Float32Array} s Specular material color
 */
function setMaterialUniforms(targetShader,alpha,a,d,s) {
  gl.uniform1f(targetShader.uniformShininessLoc, alpha);
  gl.uniform3fv(targetShader.uniformAmbientMaterialColorLoc, a);
  gl.uniform3fv(targetShader.uniformDiffuseMaterialColorLoc, d);
  gl.uniform3fv(targetShader.uniformSpecularMaterialColorLoc, s);
}

//-------------------------------------------------------------------------
/**
 * Sends light information to the shader
 * @param {Float32Array} loc Location of light source
 * @param {Float32Array} a Ambient light strength
 * @param {Float32Array} d Diffuse light strength
 * @param {Float32Array} s Specular light strength
 */
function setLightUniforms(targetShader,loc,a,d,s) {
  gl.uniform3fv(targetShader.uniformLightPositionLoc, loc);
  gl.uniform3fv(targetShader.uniformAmbientLightColorLoc, a);
  gl.uniform3fv(targetShader.uniformDiffuseLightColorLoc, d);
  gl.uniform3fv(targetShader.uniformSpecularLightColorLoc, s);
}
