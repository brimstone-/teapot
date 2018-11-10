//-------------------------------------------------------------------------
/**
 * Asynchronously read a server-side text file
 */
function asyncGetFile_Mesh(url) {
  console.log("Getting text file");
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
    console.log("Made promise");
  });
}

//----------------------------------------------------------------------------------
/**
 * Populate buffers with data
 */
function setupMesh(filename) {
  myMesh = new TriMesh();
  myPromise = asyncGetFile_Mesh(filename);
  myPromise.then((retrievedText) => {
    myMesh.loadFromOBJ(retrievedText);
    console.log("Yay! got the " + filename + " file");
  })
  .catch((reason) => {
    console.log('Handle rejected promise ('+reason+') here.');
  });
}
