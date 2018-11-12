//----------------------------------------------------------------------------------
/**
 * Populate cube buffers with data
 */
function setupCubeBuffers() {
  // Create a buffer for the cube's vertices.

  cubeVertexBuffer = gl.createBuffer();

  // Select the cubeVerticesBuffer as the one to apply vertex
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);

  // Now create an array of vertices for the cube.

  var vertices = [
    // Front face
    -20.0, -20.0,  20.0,
     20.0, -20.0,  20.0,
     20.0,  20.0,  20.0,
    -20.0,  20.0,  20.0,

    // Back face
    -20.0, -20.0, -20.0,
    -20.0,  20.0, -20.0,
     20.0,  20.0, -20.0,
     20.0, -20.0, -20.0,

    // Top face
    -20.0,  20.0, -20.0,
    -20.0,  20.0,  20.0,
     20.0,  20.0,  20.0,
     20.0,  20.0, -20.0,

    // Bottom face
    -20.0, -20.0, -20.0,
     20.0, -20.0, -20.0,
     20.0, -20.0,  20.0,
    -20.0, -20.0,  20.0,

    // Right face
     20.0, -20.0, -20.0,
     20.0,  20.0, -20.0,
     20.0,  20.0,  20.0,
     20.0, -20.0,  20.0,

    // Left face
    -20.0, -20.0, -20.0,
    -20.0, -20.0,  20.0,
    -20.0,  20.0,  20.0,
    -20.0,  20.0, -20.0
  ];

  // Now pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Map the texture onto the cube's faces.

  cubeTCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeTCoordBuffer);

  var textureCoordinates = [
    // Front
    0.0 , 0.0 ,
    20.0, 0.0 ,
    20.0, 20.0,
    0.0 , 20.0,
    // Back
    0.0 , 0.0 ,
    20.0, 0.0 ,
    20.0, 20.0,
    0.0 , 20.0,
    // Top
    0.0 , 0.0 ,
    20.0, 0.0 ,
    20.0, 20.0,
    0.0 , 20.0,
    // Bottom
    0.0 , 0.0 ,
    20.0, 0.0 ,
    20.0, 20.0,
    0.0 , 20.0,
    // Right
    0.0 , 0.0 ,
    20.0, 0.0 ,
    20.0, 20.0,
    0.0 , 20.0,
    // Left
    0.0 , 0.0 ,
    20.0, 0.0 ,
    20.0, 20.0,
    0.0 , 20.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.

  cubeTriIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeTriIndexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  var cubeVertexIndices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ]

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
}

//----------------------------------------------------------------------------------
/**
 * Populate buffers with data
 */
function setupBuffers() {
  setupCubeBuffers();
}

//----------------------------------------------------------------------------------
/**
 * Draw a cube based on buffers.
 */
function drawCube(){

  // Draw the cube by binding the array buffer to the cube's vertices
  // array, setting attributes, and pushing it to GL.

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
  gl.vertexAttribPointer(shaderProgramCube.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  // Set the texture coordinates attribute for the vertices.

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeTCoordBuffer);
  gl.vertexAttribPointer(shaderProgramCube.texCoordAttribute, 2, gl.FLOAT, false, 0, 0);

  // Specify the texture to map onto the faces.

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
  gl.uniform1i(gl.getUniformLocation(shaderProgramCube, "uSampler"), 0);

  // Draw the cube.

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeTriIndexBuffer);
  setMatrixUniforms(shaderProgramCube);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}

//-------------------------------------------------------------------------
/**
 * Asynchronously read a server-side text file
 */
function asyncGetFile_Map(url, face) {
  console.log("Getting image: " + url + " on face: " + face);
  return new Promise((resolve, reject) => {
    cubeImages[face] = new Image();
    cubeImages[face].onload = () => resolve({url, status: 'ok'});
    cubeImages[face].onerror = () => reject({url, status: 'error'});
    cubeImages[face].src = url
    console.log("Made promise");  
  });
}
//----------------------------------------------------------------------------------
/**
 * Setup a promise to load a texture
 */
function setupPromise(filename, face) {
    myPromise = asyncGetFile_Map(filename, face);
    // We define what to do when the promise is resolved with the then() call,
    // and what to do when the promise is rejected with the catch() call
    myPromise.then((status) => {
        handleTextureLoaded(cubeImages[face], face)
        console.log("Yay! got the " + filename + " file");
    })
    .catch(
        // Log the rejection reason
       (reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
        });
}

//----------------------------------------------------------------------------------
/**
 * Creates textures for application to cube.
 */
function setupTextures() {

  cubeMap = gl.createTexture();
  
  var path = "textures/street";

  setupPromise(`${path}/posz.jpg`, 0);
  setupPromise(`${path}/negz.jpg`, 1);
  setupPromise(`${path}/posy.jpg`, 2);
  setupPromise(`${path}/negy.jpg`, 3);
  setupPromise(`${path}/posx.jpg`, 4);
  setupPromise(`${path}/negx.jpg`, 5);
}

//----------------------------------------------------------------------------------
/**
 * Texture handling. Generates mipmap and sets texture parameters.
 * @param {Object} image Image for cube application
 * @param {Number} face Which face of the cubeMap to add texture to
 */
function handleTextureLoaded(image, face) {
  console.log("handleTextureLoaded, image = " + image);
  texturesLoaded++;

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);

  if (face == 0) {
  	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }
  else if (face == 1) {
  	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }
  else if (face == 2) {
  	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }
  else if (face == 3) {
  	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }
  else if (face == 4) {
  	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }
  else if (face == 5) {
  	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  // clamping
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // filtering
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}
