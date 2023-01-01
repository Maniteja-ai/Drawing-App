const canvas = document.querySelector('.drawing-board canvas'),
toolBtns = document.querySelectorAll('.tool'),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d") // getcontext() method returns a drawing context on the canvas;

// global variables with default value;
let prevMouseX,prevMouseY,snapshot;
let isDrawing = false,
selectedTool = "brush",
brushWidth =5,
selectedColor= '#000';

const setCanvasBackground = () => {
    // setting whole canvas bg color to white , so the download img bg will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0, canvas.width,canvas.height);
    ctx.fillStyle = selectedColor; //  setting fillstyle back to the selectcolor, it'll be the brush color;
};

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height return s viewable width/height of an element
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      setCanvasBackground();
});

const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect background; 
    if(!fillColor.checked){
        return  ctx.strokeRect(e.offsetX,e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY); // strokeRect() method draws a rectangle (no fill) it takes strokeRect(x-cor,y-cor,width,height) for rect;
    }
    ctx.fillRect(e.offsetX,e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle;
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow(prevMouseX-e.offsetX,2) + Math.pow(prevMouseY-e.offsetY,2));
    ctx.arc(prevMouseX,prevMouseY,radius,0,2*Math.PI) //ctx.arc(x-cor,y-cor,rad,startangle,end-angle)
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillcolor is checked fill circle else draw border circle;

}

const drawTriangle = (e) => {
    ctx.beginPath();// creating new path to draw traingle;
    ctx.moveTo(prevMouseX,prevMouseY); //moving traingle to mouse pointer
    ctx.lineTo(e.offsetX,e.offsetY);  // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX*2-e.offsetX,e.offsetY) //creating bottom line of triangle;
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillcolor is checked fill circle else draw border triangle;
}
const startDraw = (e) => {
    isDrawing =true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMousex value;
    prevMouseY = e.offsetY; // passing current mousey position as prevMousey value;
    // creating new path to draw
    ctx.beginPath() // beginpath method create a new path to drawpoint
    ctx.lineWidth = brushWidth; // set line width;
    ctx.strokeStyle = selectedColor; // passing selected color as stroke style;
    ctx.fillStyle = selectedColor; // passing selected color as fill style;
    //copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0,0,canvas.width,canvas.height) // this returns an ImageData object that copies the pixel data
};

const drawing = (e) => {
    if(!isDrawing) return; // if isDrawing is false return 
    ctx.putImageData(snapshot, 0, 0); // adding the copied canvas dat on to this canvas
    if(selectedTool === "brush" || selectedTool === "eraser")
    {
        // if selected tool is eraser then set strokestyle to white;
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
         //offsetX,offesetY returns x and y coordinates of the mouse pointer
         //creating line according to the mopuse  pointer;
         ctx.lineTo(e.offsetX,e.offsetY) // lineto method creates a new line ..  ctx.lineTo(x-cor,y-cor);
         ctx.stroke(); //drawing/filling line with color;
    }else if(selectedTool === 'rectangle')
    {
        drawRect(e);
    }else if(selectedTool === 'circle')
    {
        drawCircle(e);
    }else if(selectedTool === 'triangle')
    {
        drawTriangle(e);
    }
    
};

toolBtns.forEach(btn => btn.addEventListener('click',() => {
    // removing active class fromthe previous option and adding on current clicked option
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool =btn.id;
    console.log(btn.id);
}));

sizeSlider.addEventListener("change", () => brushWidth=sizeSlider.value); // passing slider value as brusheSize;

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // removing active class fromthe previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn bg color as selected color value;
        selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color');
    });
});

colorPicker.addEventListener("change", () => {
    //passing picked color value from color picker to last color btn background;
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0,0,canvas.width,canvas.height) // clearing whole canvas;
    setCanvasBackground();
})

saveImg.addEventListener('click', () => {
    const link = document.createElement('a') // creating <a> element;
    link.download = `${Date.now()}.jpg`; // passing current date as link download value;
    link.href = canvas.toDataURL();// passing canvasData as link href value;
    link.click(); // clicking link to download image;
})

canvas.addEventListener('mousedown',startDraw);
canvas.addEventListener('mousemove',drawing);
canvas.addEventListener('mouseup', () => isDrawing=false);