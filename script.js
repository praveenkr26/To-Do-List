let input = document.querySelector('#taskInput');
let btn = document.querySelector('#addTask');
let addedSection = document.querySelector('#AddedTask');
let completedSection = document.querySelector('#completedTask');
let container = document.querySelector('#taskContainer');
let addedCount = document.querySelector('#addedCounter');
let completedCount = document.querySelector('#completedCounter');
let clearAddedBtn = document.querySelector('#clearAdded');
let clearCompletedBtn = document.querySelector('#clearCompleted');

let added = [];
let completed = [];

btn.addEventListener('click', addTask);
input.addEventListener('keypress', function(e) {
    if(e.key === 'Enter') addTask();
});

clearAddedBtn.addEventListener('click', function() {
    if(added.length > 0 && confirm('Sab Added Tasks delete kar do?')) {
        added = [];
        save();
        show();
    }
});

clearCompletedBtn.addEventListener('click', function() {
    if(completed.length > 0 && confirm('Sab Completed Tasks delete kar do?')) {
        completed = [];
        save();
        show();
    }
});

function addTask() {
    let text = input.value;
    
    if(text === '') {
        input.classList.add('vibrate');
        setTimeout(() => input.classList.remove('vibrate'), 500);
        return;
    }
    
    let task = {
        id: Date.now(),
        text: text
    };
    
    added.unshift(task);
    save();
    input.value = '';
    input.focus();
    show();
}

function show() {
    addedSection.querySelectorAll('.Task').forEach(el => el.remove());
    completedSection.querySelectorAll('.Task').forEach(el => el.remove());
    
    added.forEach(task => addedSection.appendChild(makeTask(task, 'added')));
    completed.forEach(task => completedSection.appendChild(makeTask(task, 'completed')));
    
    addedCount.innerText = added.length;
    completedCount.innerText = completed.length;
    
    container.style.display = (added.length || completed.length) ? 'flex' : 'none';
}

function makeTask(task, type) {
    let div = document.createElement('div');
    div.classList.add('Task');
    div.setAttribute('data-id', task.id);
    
    let check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = (type === 'completed');
    
    let span = document.createElement('span');
    span.innerText = task.text;
    
    let edit = document.createElement('i');
    edit.classList.add('fa-solid', 'fa-pen-nib');
    edit.style.cursor = 'pointer';
    
    let del = document.createElement('i');
    del.classList.add('fa-solid', 'fa-trash-can');
    del.style.cursor = 'pointer';
    
    check.addEventListener('change', () => {
        check.checked ? moveComplete(task.id) : moveAdd(task.id);
    });
    
    del.addEventListener('click', () => {
        type === 'added' ? 
            added = added.filter(t => t.id !== task.id) : 
            completed = completed.filter(t => t.id !== task.id);
        save();
        show();
    });
    
    edit.addEventListener('click', () => editTask(task.id, span, type));
    
    div.appendChild(check);
    div.appendChild(edit);
    div.appendChild(del);
    div.appendChild(span);
    
    return div;
}

function moveComplete(id) {
    let idx = added.findIndex(t => t.id === id);
    if(idx !== -1) {
        completed.push(added.splice(idx, 1)[0]);
        save();
        show();
    }
}

function moveAdd(id) {
    let idx = completed.findIndex(t => t.id === id);
    if(idx !== -1) {
        added.unshift(completed.splice(idx, 1)[0]);
        save();
        show();
    }
}

function editTask(id, span, type) {
    let oldText = span.innerText;
    let input = document.createElement('input');
    input.type = 'text';
    input.value = oldText;
    input.classList.add('edit-input');
    
    span.replaceWith(input);
    input.focus();
    input.select();
    
    let done = false;
    
    function save_edit() {
        if(done) return;
        
        let newText = input.value.trim();
        if(newText === '') {
            alert('Task khali nahi ho sakta!');
            setTimeout(() => {
                input.focus();
                input.select();
            }, 100);
            return;
        }
        
        done = true;
        let arr = type === 'added' ? added : completed;
        let t = arr.find(x => x.id === id);
        if(t) t.text = newText;
        
        save();
        show();
    }
    
    input.addEventListener('keypress', e => {
        if(e.key === 'Enter') save_edit();
    });
    
    input.addEventListener('blur', save_edit);
}

function save() {
    localStorage.setItem('added', JSON.stringify(added));
    localStorage.setItem('completed', JSON.stringify(completed));
}

function load() {
    let a = localStorage.getItem('added');
    let c = localStorage.getItem('completed');
    if(a) added = JSON.parse(a);
    if(c) completed = JSON.parse(c);
}

load();
show();