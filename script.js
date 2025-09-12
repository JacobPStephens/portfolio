
"use strict";

let deltaTime = 0.0;
let mouseX = 0.0;
let mouseY = 0.0;

function main() {
    var canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl");

    if (!gl) {
        console.log("not gl");
        return;
    }
    var vertexShaderSource = document.querySelector("#vertexShader").textContent;
    var fragmentShaderSource = document.querySelector("#fragmentShader").textContent;

    //console.log("Vertex source: " + vertexShaderSource);
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    var shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    console.log("a_position location:", positionAttributeLocation);
    var positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [
        -1, -1,
        -1, 1,
        1, 1,

        -1, -1,
        1, -1,
        1, 1
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0,);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);
    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset 
    );

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
    var uniLoc = gl.getUniformLocation(shaderProgram, "dt");
    var timeUniLoc = gl.getUniformLocation(shaderProgram, "time");
    var mouseXUniLoc = gl.getUniformLocation(shaderProgram, "mouseX");
    var mouseYUniLoc = gl.getUniformLocation(shaderProgram, "mouseY");
    var aspectLoc = gl.getUniformLocation(shaderProgram, "aspect");

    let prev = 0;
    let time = 0;
    function render(curr) {
        curr *= 0.001;
        deltaTime = curr - prev;
        prev = curr;
        //console.log("WINDOW WIDTH " + window.innerWidth);
        //console.log(mouseX);
        time += deltaTime;

        gl.useProgram(shaderProgram);
        gl.uniform1f(timeUniLoc, time);
        gl.uniform1f(mouseXUniLoc, mouseX / window.innerWidth);
        console.log("sending " + (window.innerWidth / window.innerHeight));
        gl.uniform1f(aspectLoc, (window.innerWidth / window.innerHeight));
        //console.log(mouseX)
        //console.log("norm" + (mouseX / window.innerWidth));
        gl.uniform1f(mouseYUniLoc, mouseY / window.innerHeight);
        gl.drawArrays(primitiveType, offset, count);
        
        requestAnimationFrame(render);

    }
    requestAnimationFrame(render);
}



function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.log("not successful creation of shader");
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);

}

function createShaderProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program);
}

document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    // console.log(event.clientX);
    // console.log(event.clientY);
});

main();