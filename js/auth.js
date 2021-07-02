const form = document.getElementById('form');

const submit = document.getElementById('send');
const authButton = document.getElementById('auth');
const regButton = document.getElementById('register');
const BASE_URL = 'BASE_URL';
getProducts();


if (submit) {
    submit.addEventListener('click', login);
}

if (authButton) {
    authButton.addEventListener('click', setAuthState);
}

if (regButton) {
    regButton.addEventListener('click', setRegState);
}

let isAuth = true;

const token = localStorage.getItem('token');
if (token) {
    closeModal();
}

function login() {
    if (isAuth) {
        authorization();
    } else {
        registration();
    }
}

function authorization() {
    const formData = new FormData(form);
    const emailPattern = /^([a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$)/gmi;
    const emailIsValid = emailPattern.test(formData.get('email'));
    const password = formData.get('password');
    const passwordIsValid = password.length >= 5;

    if (emailIsValid && passwordIsValid) {
        const user = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        authUser(user).then(data => {
            data.json().then(result => {
                localStorage.setItem('token', result);
                closeModal();
            });
        });
    }
}

function registration() {
    const formData = new FormData(form);
    const emailPattern = /^([a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$)/gmi;
    const emailIsValid = emailPattern.test(formData.get('email'));
    const password = formData.get('password');
    const confirm = formData.get('confirm');
    const passwordIsValid = (password === confirm) && (password.length >= 5);
    if (emailIsValid && passwordIsValid) {
        const user = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        registerUser(user).then(data => {
            data.json().then(result => {
                localStorage.setItem('token', result);
                closeModal();
            });
        });
    }
}

function closeModal() {
    const wrapper = document.getElementsByClassName('wrapper')[0];
    if (wrapper) {
        wrapper.style.display = 'none';
    }
}

function showModal() {
    const wrapper = document.getElementsByClassName('wrapper')[0];
    if (wrapper) {
        wrapper.style.display = 'flex';
    }
}

function registerUser(data) {
    return fetch(BASE_URL.concat('/register'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function authUser(data) {
    return fetch(BASE_URL.concat('/auth'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}


function logout() {
    localStorage.removeItem('token');
    showModal();
}

function setAuthState() {
    if (!isAuth) {
        isAuth = true;
        document.getElementsByClassName('form__title')[0].innerText = 'Authorization';
        regButton.classList.remove('actions__button_active');
        authButton.classList.add('actions__button_active');
        document.getElementsByClassName('modal__field')[2].style.display = 'none';
    }
}

function setRegState() {
    if (isAuth) {
        isAuth = false;
        document.getElementsByClassName('form__title')[0].innerText = 'Registration';
        authButton.classList.remove('actions__button_active');
        regButton.classList.add('actions__button_active');
        document.getElementsByClassName('modal__field')[2].style.display = 'flex';
    }
}


// ------------------------------------------

const name = document.getElementById('name');
const desc = document.getElementById('desc');
const price = document.getElementById('price');
const image = document.getElementById('img');

const saveProductBtn = document.getElementById('saveProduct');
const editProductBtn = document.getElementById('editProduct');

saveProductBtn.addEventListener('click', saveProduct);
editProductBtn.addEventListener('click', saveEdited);

let photo = null;

function saveProduct() {
    const product = {
        name: name.value,
        description: desc.value,
        price: price.value,
        photo: photo
    };

    fetch(BASE_URL.concat('/products'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    }).then(result => result.json().then(data => {
        clearFields();
    }));
}

function clearFields() {
    name.value = '';
    desc.value = '';
    price.value = '';
    image.src = './images/stub.png';
}

let products;

function getProducts() {
    fetch(BASE_URL.concat('/products'), {
        method: 'GET'
    }).then(result => result.json().then(data => {
        products = data;
        showProducts();
    }));
}


const productsArea = document.getElementsByClassName('products')[0];

function drawCard(product) {
    const photo = product.photo ? product.photo : './images/stub.png';
    const card = `<div class="card">
                    <img class="card__photo" src="${photo}" alt="">

                    <div class="card__info">
                        <div class="card__info-data">
                            <span class="card__info-data-name">${product.name}</span>
                            <span class="card__info-data-price">${product.price}$</span>
                        </div>

                        <div class="card__info-description">
                            ${product.description}
                        </div>
                    </div>

                    <div class="card__edit">
                        <button class="card__edit-item" onclick="deleteItem('${product._id}')">Delete</button>
                        <button class="card__edit-item" onclick="editItem('${product._id}')">Edit</button>
                    </div>
                </div>`;
    productsArea.innerHTML += card;
}

function showProducts() {
    productsArea.innerHTML = '';
    products.forEach(element => drawCard(element));
}

function loadFile(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        image.src = e.target.result;
        photo = e.target.result
    }
    console.log(event);
    reader.readAsDataURL(event.target.files[0]);
}

function deleteItem(id){
    fetch(BASE_URL.concat('/product', '?id=', id), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => result.json().then(_ => {
        const item = products.find(obj => obj._id === id);
        const index = products.indexOf(item);
        products.splice(index, 1); //products = products.filter(p => p._id !== id);
        showProducts();
    }))
    .catch(er => console.log(er));
}

let editedItem;

function editItem(id) {
    editedItem = products.find(obj => obj._id === id);
    name.value = editedItem.name;
    desc.value = editedItem.description;
    price.value = editedItem.price;
    image.src = editedItem.photo ? editedItem.photo : './images/stub.png';

    saveProductBtn.style.display = 'none';
    editProductBtn.style.display = 'block';
}

async function saveEdited() {
    editedItem.name = name.value;
    editedItem.description = desc.value;
    editedItem.price = price.value;
    editedItem.photo = image.src;

    try {
        await fetch(BASE_URL.concat('/product'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedItem)
        });
    } catch (error) {
        console.log(error);
    }
    
    const index = products.find(p => p._id === editedItem._id);
    products[index] = editedItem;

    saveProductBtn.style.display = 'block';
    editProductBtn.style.display = 'none';
    clearFields();
    showProducts();
}
