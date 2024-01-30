const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById("mode-btn");
const destoryBtn = document.getElementById("destory-btn");
const eraserBtn = document.getElementById("eraser-btn");

const colorOptions = Array.from(
    document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");
const lineWidth=document.getElementById("line-width");
const canvas = document.querySelector("canvas");
/*context는 기본적으로 붓(브러쉬)이야.
canvas는 단시 html의 한 element지만, 붓을 사용할 수 있도록, getContext라는 
강력한 것을 가지고 있음.

JS에서 canvas를 사용해 브라우저에 2D 혹은 3D 그래픽을 그릴 수 있다.
html에서는 canvas 한 번 써주는 게 전부이고,
나머지 작업은 대부분 js에서 이루어진다.

1. JS에서 canvas 불러오기
- const canvas = document.querySelector("canvas");

2. context 작성 
- context는 캔버스에 그림을 그릴 때 사용하는 붓이다.
- canvas.getContext 로 불러온 다음 2d를 선택한다. (주의! d 소문자임)

3. 캔버스 크기 설정
- css에서 캔버스 크기 설정을 한 후 js에서도 작성해준다.
- 이후에는 width 와 height를 js에서만 수정할 것임 (css에서 X)

4. 캔버스 위에 사각형 그리기
- canvas 좌표 시스템:
캔버스 좌상단이 좌표 0.0, 가로 X, 세로 Y
- 사각형 채우는 함수 fillRect 작성
-> ctx.fillRect(x값, y값, w값, h값);
*/
const ctx = canvas.getContext("2d"); //대문자 D(x) d(o)

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width=CANVAS_WIDTH;
canvas.height=CANVAS_HEIGHT;

//사각형을 채우는 함수 fillRect() 단축 함수 
//fillRect()함수는 사각형을 그리고 채우라는 뜻.
/*사실 사각형을 그리려면 기본적인 단계들을 하나씩 거쳐야 함
- 사각형 선 그리기: ctx.rect(x, y, w, h);
- 선의 색이 적용되지 않아서 보이지 않는다
-> 다음 줄에 ctx.stroke() / ctx.fill() 해서 테두리만 그리거나 채울 수 있음
- 끊어가기를 원하는 곳 맨 앞에 ctx.beginPath();추가해 새 경로 만들기.
-> 기본 default 색은 검정이고, 색을 바꿀려면 ctx.fillStryle ="red"; 하고 ctx.fill()하면 됨
*요약
- canvas에서 그림을 그릴 때는 단계별로 진행 필요
- 그린 그림들의 경로를 나눌 수 있음
-> 새 경로 시작하기: beginPath()
*/
/*
사실 rect 조차 shortcut function이었다는 점..(빠밤)
더 작게 나눠진 function을 써보자! -> moveTo / lineTo

- moveTo(x, y); -> 브러쉬의 좌표를 움직여줌
- lineTo(x, y) -> 라인을 그려줌

*수평인 직선을 그리려면 두 y값이 같아야 한다
*라인이 끝난 점이 다음에 시작하는 브러쉬 좌표이다
* 정리하자면 fillRect = fill+Rect = fill + (moveTo+lineTo)

+ (연습) 선으로 사각형 그리기

ctx.moveTo(50, 50);
ctx.lineTo(100, 50);
ctx.lineTo(100, 100);
ctx.lineTo(50, 100);
ctx.lineTo(50, 50);
ctx.fill();
---------------
ctx.moveTo(50, 50);
ctx.lineTo(150, 50);
ctx.lineTo(150, 150);
ctx.lineTo(50, 150);
ctx.lineTo(50, 50);
ctx.stroke();
*/

/*
ctx.fillRect(200, 200, 50, 200);
ctx.fillRect(400, 200, 50, 200);
ctx.lineWidth = 2; 위치가 중요함
ctx.fillRect(300, 300, 50, 100);
ctx.fillRect(200, 200, 200, 20);
ctx.moveTo(200, 200);
ctx.lineTo(325, 100);
ctx.lineTo(450, 200);
ctx.fill();
*/
/*
집 만들기 🔨🏠

- ctx.fillRect(200, 200, 50, 200); → 왼쪽 벽 만들기
- ctx.fillRect(400, 200, 50, 200); → 오른쪽 벽 만들기
- ctx.lineWidth = 2; → 선 굵기 조절
- ctx.strokeRect(300, 300, 50, 100); → 문 만들기
: strokeRect()는 선만 그려주고 채워주지 않는.
- ctx.fillRect(200, 200, 200, 20); → 천장 만들기
- ctx.moveTo(200, 200); → 지붕 만들기 위해 연필(좌표) 이동
- ctx.lineTo(325, 100);
- ctx.lineTo(450, 200);
- ctx.fill();

다 채워진 게 보기 좋으니까, strokeRect를 fillRect로 변경해줌.
- ctx.fillRect(300, 300, 50, 100);
*/
//ctx.arc()는 많은 argument가 있음.
//처음으로 한 argument는  x,y좌표는 어디서 시작할 지에 대한 거,
//두번째는 redius반지름 원이 얼마나 큰지, startangle, endgangle도 있음, 총5개 

//ctx.beginpath()();는 새로운 경로를 만듦
//만약 무언가의 색을 바꿔주려고 한다면, 그 색이 우선 새로운  path가 필요한지 아닌지 생각을 해야함,
//아니면 무언가의 전체 색을 바꿀 수 있음
ctx.lineWidth = lineWidth.value;
//moveTo는 브러쉬를 이동시킬 때 사용하는 메소드
ctx.lineCap = "round";
let isPainting=false;
let isFilling=false;

function onMove(event){
    if(isPainting){
        ctx.lineTo(event.offsetX,event.offsetY);
        ctx.stroke();
        return;
    }
    
    ctx.moveTo(event.offsetX,event.offsetY);
}


function startPainting(){
    isPainting = true;
}

function cancelPainting(){
    isPainting=false;
    ctx.beginPath();
}

function onLineWidthChange(event){
    ctx.lineWidth=event.target.value;
}

function onColorChange(event){
    ctx.strokeStyle=event.target.value;
    ctx.fillStyle=event.target.value;
}

function onColorClick(event){
    const colorValue=event.target.dataset.color;
    ctx.strokeStyle=colorValue;
    ctx.fillStyle=colorValue;
    color.value=colorValue;
}

function onModeClick(){
    if(isFilling){
        isFilling=false;
        modeBtn.innerText="Fill";
    } else{
        isFilling=true;
        modeBtn.innerText="Draw";
    }
}

function onCanvasClick(){
    if(isFilling){
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    }
}

function onDestoryClick(){
    ctx.fillStyle ="white";
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}

function onEraserClick(){
    ctx.strokeStyle="white";
    isFilling=false
    modeBtn.innerText="Fill";

}


function onFileChange(event){
    const file = event.target.files[0]; //파일을 갖져옴
    const url=URL.createObjectURL(file); //파일을 가리키는 url을 요청
    const image = new Image()
    image.src=url; //ulr 설정
    image.onload = function(){ //이미지가 로딩되면 그림.
        ctx.drawImage(image, 0,0, CANVAS_WIDTH,CANVAS_HEIGHT);
        fileInput.value = null;
    }
}

function onDoubleClick(event){
    ctx.save();
    const text = textInput.value;
    if (text !== ""){
        ctx.lineWidth = 1;
        ctx.font = '55px serif'
        ctx.fillText(text,event.offsetX, event.offsetY);
        ctx.restore();
    }
}

function onSaveClick(){
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url
    a.download = "myDrawing.png";
    a.click();
}
canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove",onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave",cancelPainting);
canvas.addEventListener("click", onCanvasClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick)); 

modeBtn.addEventListener("click", onModeClick);
destoryBtn.addEventListener("click", onDestoryClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change",onFileChange);
saveBtn.addEventListener("click", onSaveClick);