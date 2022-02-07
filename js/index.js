// Your code goes here

const usersURL = 'https://jsonplaceholder.typicode.com/users';
const postsURL = 'https://jsonplaceholder.typicode.com/posts';
const commentsURL = 'https://jsonplaceholder.typicode.com/comments';



function sendUsers(method, url) {
    return fetch(url).then(response => {
        return response.json()
    })
}

sendUsers('GET', usersURL)
    .then((data) => {
        createTable1(data);
    })



const createTable1 = (data, row) => {
    document.querySelector('.users').innerHTML = '';
    let editingRow = row;
    data.forEach(row => {
        let tr = document.createElement('tr');
        let editButton = document.createElement('button');
        let saveButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        editButton.innerHTML = 'edit';
        saveButton.innerHTML = 'save';
        deleteButton.innerHTML = 'delete';

        editButton.addEventListener('click', () => onEdit(row, data));
        saveButton.addEventListener('click', () => onSave(row, data));
        deleteButton.addEventListener('click', () => onDelete(row, data));

        if(editingRow && row === editingRow) {
            for (let prop in row) {
                if (typeof row[prop] !== 'object') {
                    let cell = document.createElement('td');
                    let input = document.createElement('input');
                    input.value = row[prop];
                    input.readOnly = prop === 'id';
                    input.addEventListener('change', (event) => onChange(event, row, prop));
                    cell.appendChild(input);
                    tr.appendChild(cell);

                } 
            } 

            tr.appendChild(saveButton);
            tr.appendChild(deleteButton);
            document.querySelector('.users').appendChild(tr);
        } else if(editingRow !== row){
            for (let prop in row) {
                if (typeof row[prop] !== 'object') {
                    let cell = document.createElement('td');
                    let input = document.createElement('input');
                    input.value = row[prop];
                    input.readOnly = true;
                    cell.appendChild(input);
                    tr.appendChild(cell);

                    if(prop === 'name'){
                        input.addEventListener('click', () => onName(row))
                    }

                }
            }
            tr.appendChild(editButton);
            tr.appendChild(deleteButton);
            document.querySelector('.users').appendChild(tr);
        } 
    })
};

const onChange = (event, row, prop) => {
    row[prop] = event.target.value;
};

const onEdit = (row, data) => {
    createTable1(data, row);
};

const onSave = (row, data) => {
    loaded()
    document.querySelector('.users').innerHTML = '';
    sendUsers('PUT', `${usersURL}/${row.id}`)
        .then(() => {
            let oldItem = data.find(item => item === row);
            data[oldItem] = row;
            createTable1(data);
        })
}

const onDelete = (row, data) => {
    loaded()
    document.querySelector('.users').innerHTML = '';
    sendUsers('DELETE', `${usersURL}/${row.id}`)
        .then(() => {
            let index = data.findIndex(item => item === row);
            data.splice(index, 1);
            createTable1(data);
        })
};

function sendPost(method, url) {
    return fetch(url).then(response => {
        return response.json()
    })
}

function sendComments(method, url) {
        return fetch(url).then(response => {
            return response.json()
        })
    }




function myFunction() {
    let spiner= document.getElementById('spiner');
    if (spiner.style.display === 'none') {
        spiner.style.display = 'bloc';
    } else {
        spiner.style.display = 'none';
    }
  }



const onName = (row ) => {
    delTable()
    loadedComents()
    let userID = row.id;
    let h1 = document.createElement('h1');
    h1.innerHTML= row.name + ' posts';
    document.querySelector('.post').appendChild(h1);

    Promise.all([sendPost('GET',postsURL), sendComments('GET', commentsURL)])
        .then(([posts, comments]) => {
            
            const postsArray = posts.filter(post => userID === post.userId);
            
            postsArray.forEach((item) => {
                let div = document.createElement('div');
                div.innerHTML= `<div class = "pt"><h2>${item.title}</h2><h3>${item.body}</h3></div>`
                document.querySelector('.post').appendChild(div)

                const commentsArray = comments.filter(function (comment) {
                    return item.id === comment.postId
                });

                commentsArray.forEach((comm) => {
                    let div = document.createElement('div');
                    document.querySelector('.post').appendChild(div)
                    div.innerHTML = `
                    <h6>Comment:</h6>
                    <p>${comm.name}</p>
                    <p>${comm.body}</p>
                    <h5>${comm.email}</h5>
                    `

                })

            })
        
        })

        
};



let sinerDiv = document.getElementById('spiner')


function addLoader(){
    let timer = 500;
    sinerDiv.classList.add('loader')
    setTimeout(delLoader, timer );
}

function delLoader() {
    sinerDiv.classList.remove('loader');
  }


function delTable(){
    document.getElementById('content').style.display = 'none'
}

function showTable(){
    document.getElementById('content').style.display = 'table'
}
  

function loaded(){
    let timer = 500;
    delTable();
    addLoader();
    setTimeout(showTable, timer );

}


function showPost(){
    document.getElementById('post').style.display = 'block'
}

function loadedComents(){
    let timer = 500;
    document.getElementById('post').style.display = 'none';
    addLoader();
    setTimeout( showPost, timer );

}