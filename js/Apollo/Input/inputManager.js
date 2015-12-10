//InputManager - handles all input events, retains key states
//on input, adds/removes property to/from inputState
//runs assigned functions of subscribers
//supports unsubscription through indexing


function InputManager(canvas, verbose){
	var im = {
                canvas: canvas,
                onMouse: onMouse,
                onKey: onKey,
                subscribe: subscribe,
                subscribers: InputList(),
                inputState: InitInputState(),
                getInputState: getInputState,
                subIndex: 0,
                verbose: verbose,
                mousePosition: { x: 0, y: 0 },
                lastMousePosition: { x: 0, y: 0 }
	};
	canvas.addEventListener('mousedown', function(event){ im.onMouse(event, 1); });
	canvas.addEventListener('mouseup', function(event){ im.onMouse(event, 0); });
    canvas.addEventListener('mousemove', function(event){ im.onMouse(event, 2)});
	window.addEventListener('keydown', function(event){ im.onKey(event, 1); });
	window.addEventListener('keyup', function(event){ im.onKey(event, 0); });
    canvas.addEventListener('mouseleave', function(event){
        im.lastMousePosition = { x: undefined, y: undefined }; 
    });
    canvas.addEventListener('mouseenter', function(event){
        im.lastMousePosition = { 
            x: event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(im.canvas.offsetLeft),
            y: event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(im.canvas.offsetTop) + 1
        };
        im.mousePosition.x = im.lastMousePosition.x;
        im.mousePosition.y = im.lastMousePosition.y;
    });
	return im;
}

function onMouse(event, state){
    event = event || window.event;
    this.lastMousePosition.x = this.mousePosition.x;
    this.lastMousePosition.y = this.mousePosition.y;
	var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(this.canvas.offsetLeft);
	var y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(this.canvas.offsetTop) + 1;
    this.mousePosition.x = x;
    this.mousePosition.y = y;
    if (state == 1){
        for (var i = 0; i < this.subscribers['mousedown'].length; i++){
            this.subscribers['mousedown'][i].func.call(this.subscribers['mousedown'][i].object, event, x, y);
        }
    }
    else if (state == 0){
        for (var i = 0; i < this.subscribers['mouseup'].length; i++){
            this.subscribers['mouseup'][i].func.call(this.subscribers['mouseup'][i].object, event, x, y);
        }
    }
    else if (state == 2){
        var movementX = this.mousePosition.x - this.lastMousePosition.x;
        var movementY = this.mousePosition.y - this.lastMousePosition.y;
        for (var i = 0; i < this.subscribers['mousemove'].length; i++){
            this.subscribers['mousemove'][i].func.call(this.subscribers['mousemove'][i].object, event, movementX, movementY);
        }
    }
}

function onKey(event, state){
    if (this.verbose)
        console.log( event.which );
    switch(event.which){
        case 32: this.inputState.space = state;
            break;
        case 37: this.inputState.leftArrow = state;
            break;
        case 38: this.inputState.upArrow = state;
            break;
        case 39: this.inputState.rightArrow = state;
            break;
        case 40: this.inputState.downArrow = state;
            break;
        case 65: this.inputState.a = state;
            break;
        case 68: this.inputState.d = state;
            break;
        case 69: this.inputState.e = state;
            break;
        case 70: this.inputState.f = state;
            break;
        case 87: this.inputState.w = state;
            break;
        case 83: this.inputState.s = state;
            break;
        case 81: this.inputState.q = state;
            break;
        case 69: this.inputState.e = state;
            break;
        case 82: this.inputState.r = state;
    }
}

//adds call to subscription list, returns index
//if key does not exist, returns 0
function subscribe(event, func, object){
	if (this.subscribers[event]){
		this.subIndex ++;
		this.subscribers[event].push({ func: func, object: object, index: this.subIndex});
		return this.subIndex;
	}
	return 0;
}

//removes subscription based on index
//if successful, returns 1, else returns 0
function unsubscribe(index){
	for (var key in subscribers){
		for (var i = 0; i < subscribers[key].length; i++)
			if (subscribers[key][i].index == index){
				subscribers[key].splice(i, 1);
				return 1;
			}
	}
	return 0;
}
	
//list of inputs and what objects are subscribed to them with which functions	
function InputList(){
	return {
		mousedown: [],
		mouseup: [],
        mousemove: [],
		leftArrow: [],
		rightArrow: [],
		upArrow: [],
		downArrow: [],
		space: [],
		w: [],
		a: [],
		s: [],
		d: [],
		x: [],
		y: [],
		z: [],
		r: [],
		v: []
	};
}

function InitInputState(){
    return {
		mousedown: false,
		mouseup: false,
		leftArrow: false,
		rightArrow: false,
		upArrow: false,
		downArrow: false,
		space: false,
		w: false,
		a: false,
		s: false,
		d: false,
		x: false,
		y: false,
		z: false,
		r: false,
		v: false
	};
}

//returns current input state
function getInputState(){
    var state = [];
    for (var key in this.inputState){
        state[key] = this.inputState[key];
    }
	return state;
}