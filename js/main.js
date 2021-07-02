const token = localStorage.getItem('token');
const BASE_URL = "BASE_URL";

if (token) {
    getUserData().then(result => result.json().then(data => setName(data.email)));
}

function setName(name) {
    const userName = document.getElementsByClassName('header__user-name')[0];
    userName.innerText = name;
}

function getUserData() {
    return fetch(BASE_URL.concat('/user', '?id=', token), {
        methond: 'GET'
    });
}

getProducts();

function getProducts() {
    fetch(BASE_URL.concat('/products'), {
        method: 'GET'
    }).then(result => result.json().then(data => showProducts(data)));
}

const productsArea = document.getElementsByClassName('products')[0];

//Draw Card
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
                </div>`;
    productsArea.innerHTML += card;
}

function showProducts(productsArea) {
    productsArea.innerHTML = '';
    productsArea.forEach(element => drawCard(element));
}
