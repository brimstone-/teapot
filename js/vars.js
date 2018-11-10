/** @global The WebGL context */
var gl;

/** @global The HTML5 canvas we draw on */
var canvas;

/** @global A simple GLSL shader program */
var shaderProgram;

/** @global The Modelview matrix */
var mvMatrix = mat4.create();

/** @global The View matrix */
var vMatrix = mat4.create();

/** @global The Projection matrix */
var pMatrix = mat4.create();

/** @global The Normal matrix */
var nMatrix = mat3.create();

/** @global The matrix stack for hierarchical modeling */
var mvMatrixStack = [];

/** @global An object holding the geometry for a 3D mesh */
var myMesh;

// View parameters
/** @global Location of the camera in world coordinates */
// var eyePt = vec3.fromValues(0.0,2.5,9.0);
var eyePt = vec3.fromValues(0.0,2.0,10.0);
/** @global Direction of the view in world coordinates */
var viewDir = vec3.fromValues(0.0,0.0,-1.0);
/** @global Up vector for view matrix creation, in world coordinates */
var up = vec3.fromValues(0.0,1.0,0.0);
/** @global Location of a point along viewDir in world coordinates */
var viewPt = vec3.fromValues(0.0,0.0,0.0);

//Light parameters
/** @global Light position in VIEW coordinates */
var lightPosition = [20,20,20];
// rotate the light position so the lighting sort of visually makes sense in the context
// of the cubemap I chose
vec3.rotateY(lightPosition, lightPosition, vec3.fromValues(0,0,0), Math.PI);
/** @global The lightPosition stack for hierarchical modeling */
var lightPositionStack = [];

/** @global Ambient light color/intensity for Phong reflection */
var lAmbient = [0,0,0];
/** @global Diffuse light color/intensity for Phong reflection */
var lDiffuse = [1,1,1];
/** @global Specular light color/intensity for Phong reflection */
var lSpecular =[0,0,0];

//Material parameters
/** @global Ambient material color/intensity for Phong reflection */
var kAmbient = [1.0,1.0,1.0];
/** @global Diffuse material color/intensity for Phong reflection */
//var kTerrainDiffuse = [205.0/255.0,163.0/255.0,63.0/255.0];
var kTerrainDiffuse = [50.0/255.0,230.0/255.0,255.0/255.0];
/** @global Specular material color/intensity for Phong reflection */
var kSpecular = [0.0,0.0,0.0];
/** @global Shininess exponent for Phong reflection */
var shininess = 23;
/** @global Edge color fpr wireframeish rendering */
var kEdgeBlack = [0.0,0.0,0.0];
/** @global Edge color for wireframe rendering */
var kEdgeWhite = [1.0,1.0,1.0];


//Model parameters
var eulerY=180;

// cubemap
var vertexPositionBuffer;

var days=0;
var yAngle = 0.0;
// var xAngle = 0.0;

// Create a place to store the textures
var cubeImage0;
var cubeImage1;
var cubeImage2;
var cubeImage3;
var cubeImage4;
var cubeImage5;
var cubeImages = [cubeImage0, cubeImage1, cubeImage2, cubeImage3, cubeImage4, cubeImage5]
var cubeMap;

// Variable to count the number of textures loaded
var texturesLoaded = 0;
