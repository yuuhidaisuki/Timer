var timers = {};
var tasknumber = 0;


function findTagsByName(tagName, name){
		var array = [];
		var tags = document.body.getElementsByTagName(tagName);
		for(var i = 0; i < tags.length ; i++){
				if(tags[i].name === name){
						array.push(tags[i]);
				}
		}
		return array;
}

function findTagsByID(tagName, id){
		var array = [];
		var tags = document.body.getElementsByTagName(tagName);
		for(var i = 0; i < tags.length ; i++){
				if(tags[i].id === id){
						array.push(tags[i]);
				}
		}
		return array;
}



function timer(field){
		//タイマーが二重起動しないようにする。
		if(field in timers){
				return;
		}

		// setIntervalでコールバックに引数を指定したい場合は、
		// 無名関数を用いたテクニックがある。
		timers[field] = setInterval(function(){ cup(field)},1000);
}

var cup = function countUp(field){
		var spans = findTagsByName("span", field);
		if(spans.length == 0){
				console.log("countUp: not found findTagsByName");
		}else if(spans.length > 1){
				console.log("countUp: too Match mached tags");
		}
		var span = spans[0];
		var cur_time = timeToInt(span.textContent);
		span.textContent = timeToString(cur_time  + 1);
}


function timeToInt(time_string){
		var hour = time_string.split(":")[0];
		var min = time_string.split(":")[1];
		var sec = time_string.split(":")[2];
		return Math.floor(parseInt(hour) * 3600) + Math.floor(parseInt(min) * 60) + Math.floor(parseInt(sec));
}

function timeToString(time_sec){
		return Math.floor(time_sec / 3600) + ":" + Math.floor(Math.floor(time_sec % 3600) / 60 ) + ":" + Math.floor(time_sec % 60);
}





function stopTime(field){
		clearInterval(timers[field]);
		// この時点でこのフィールドは用無しなので削除
		delete timers[field];
}


function clearTime(field){
		stopTime(field);
		findTagsByName("span", field)[0].textContent = timeToString(0);
}



function addTask(field, parentNode){
		tasknumber++;
		var name = "task" + tasknumber;
		var new_element = makeDiv(name, name + ":");
		var new_text = document.createElement("input");
		new_text.name = name;
		new_text.type = "text";
		new_element.appendChild(new_text);
		new_element.appendChild(makeButton(name, "start", function(){ timer(name); }));
		new_element.appendChild(makeButton(name, "stop", function(){ stopTime(name); }));
		new_element.appendChild(makeButton(name, "clear", function(){ clearTime(name); }));
		new_element.appendChild(makeSpan(name, "0:0:0"));
		parentNode.appendChild(new_element);
}



function makeButton(name, value, handler){
		var new_elem = document.createElement("input");
		new_elem.type = "button";
		new_elem.value =  value;
		new_elem.onclick = handler;
		return new_elem;
}

function makeDiv(name, innerHTML){
		var new_elem = document.createElement("div");
		new_elem.name = name;
		new_elem.innerHTML = innerHTML;
		return new_elem;
}

function makeSpan(name, innerHTML){
		var new_elem = document.createElement("span");
		new_elem.name = name;
		new_elem.innerHTML = innerHTML;
		return new_elem;
}


/*
   日報用のアウトプット
 */
function outputText(textNode, format){
		var outText = "";
		var totalTime = 0;

		var tasks_div = findTagsByID('div', 'tasklist');
		var tasks = tasks_div[0].children;

		for(i = 0; i < tasks.length; i++){
				var task_children = tasks[i].children;

				for(j = 0; j < task_children.length; j++){

						if(task_children[j].tagName === "INPUT" && task_children[j].type === "text"){
								if(format === "plane"){	
										outText += "・" + task_children[j].value;
								}else if(format === "csv"){
										outText += task_children[j].value;
								}
						}

						if(task_children[j].tagName === "SPAN" ){
								if(format === "plane"){	
										outText += "：" + task_children[j].textContent + "<br>"
								}else if(format === "csv"){
										outText += "," + task_children[j].textContent +"<br>"
								}
								totalTime += timeToInt(task_children[j].textContent);	
						}
				}
		}


		var timeLimit = parseInt(document.getElementsByName("setTimeLimit")[0].value);
		if(isNaN(timeLimit)){
						timeLimit = DEFAULT_TIME_LIMIT;
						}
						var otherTime = totalTime - timeLimit;


						textNode.innerHTML = outText;

						if(format === "plane"){
						textNode.innerHTML += "Total:" + timeToString(totalTime) + "<br>";
						textNode.innerHTML += "Other:" + timeToString(otherTime) + "<br>";
						}else if(format === "csv"){
						textNode.innerHTML += "Total," + timeToString(totalTime) + "<br>";
						textNode.innerHTML += "Other," + timeToString(otherTime) + "<br>";
						}
						}


window.onload = function(){ addTask('task0', findTagsByID('div', 'tasklist')[0] ) };
