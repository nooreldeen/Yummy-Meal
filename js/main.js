/// <reference types="../@types/jquery"/>

// {
//     let navTap = $(".nav-tap").outerWidth();
//     $(".sidebar").css("left", -navTap);
//     // close nav on click close icon
//     $("#close-x").on("click",function(){
//       console.log("hello from close");
//       $("#bar").css("display", "block");
//       $("#close-x").css("display", "none");
//       $(".sidebar").css("left", -navTap);
//       $('ul').css('top','100px')
//     });
//     // open nav on click bar icon
//     $("#bar").on("click", function () {
//       console.log("hello from bar");
//       $(".sidebar").css("left", "0px");
//       $("#bar").css("display", "none");
//       $("#close-x").css("display", "block");
//       // d-none dose not make animate
//     });
// }


let rowData = document.getElementById("rowData");
let searchContainer = document.querySelector(".searchContainer");

// lazy loading
$(function(){
  $('.lazy-loading').fadeOut(500,function(){
    $('.lazy-loading').addClass('d-none')
  })
  $("body").css("overflow", "visible")
})


// inner lazy loading
function innerLazyLoading(){
  $('.inner-lazy-loading').removeClass('d-none')
  $('.inner-lazy-loading').fadeOut(300,function(){
    $('.inner-lazy-loading').addClass('d-none')
  })
}

closeNav();
function openNav() {
  $(".side-nav-menu").animate({ left: 0 }, 500);
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");
  for (let i = 0; i < 6; i++) {
    $(".links li")
      .eq(i)
      .animate({ top: 0 }, (i + 6) * 100);
  }
}
function closeNav() {
  // console.log('hello')
  let navTap = $(".nav-tap").outerWidth();
  $(".side-nav-menu").animate({ left: -navTap }, 500);
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");
  $(".links li").animate({ top: 300 }, 500);
}
$(".open-close-icon").on("click", function () {
  // console.log('helo click icon');
  if ($(".side-nav-menu").css("left") == "0px") {
    closeNav();
  } else {
    openNav();
  }
});

$("#search").on("click", function () {
  innerLazyLoading()
  $(".meals").addClass("d-none");
  
  $(".searchContainer").removeClass("d-none");
  closeNav();
});

async function getMeals() {
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`
  );
  res = await res.json();
  res = await res.meals;
  // console.log(res);
  displayMeals(res);
}
getMeals();
// Display 25 meals when open the website and display any meals from my chooise
async function displayMeals(arr) {
  // let rest = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${arr[0].idMeal}`);
  // rest = await rest.json();
  // console.log(rest);
  let data = "";
  for (let i = 0; i < arr.length; i++) {
    data += `
        <div class="col-md-3">
        <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative  overflow-hidden rounded-2 ">
            <img class="w-100" src="${arr[i].strMealThumb}"
                alt="">
            <div class="meal-layer bg-white position-absolute d-flex align-items-center ">
                <h3>${arr[i].strMeal}</h3>
            </div>
        </div>
    </div>
      `;
  }
  rowData.innerHTML = data;
}
$("#home").on("click", function () {
  innerLazyLoading()
  $(".searchContainer").addClass("d-none");
  $(".meals").removeClass("d-none");
  getMeals();
  closeNav();
});

async function getMealDetails(mealID) {
  console.log(mealID);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  res = await res.json();

  // console.log(res.meals[0]);
  // console.log(res.meals[0].strMeal);
  // console.log('hello getMealDetails');
  displayMealDetails(res.meals[0]);
}
function displayMealDetails(meal) {
  console.log(meal.strMealThumb);

  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
      <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let data = `
  <div class="col-md-4 text-white">
  <img class="w-100 rounded-3"
      src="${meal.strMealThumb}" alt="">
  <h2>${meal.strMeal}</h2>
</div>
<div class="col-md-8 text-white">
  <h2>Instructions</h2>
  <p>${meal.strInstructions}</p>
  <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
  `;

  rowData.innerHTML = data;
}

// fetch data of categories and send it to displayCategories function
$("#categories").on("click", function () {
  innerLazyLoading()
  $(".searchContainer").addClass("d-none");
  $(".meals").removeClass("d-none");
  getCategories();
  closeNav();
});
async function getCategories() {
  // rowData.innerHTML="";
  // searchContainer.innerHTML="";
  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  res = await res.json();
  res = await res.categories;
  // console.log(resCat[0]);
  displayCategories(res);
}
// parameter from getCategories Fun
function displayCategories(arr) {
  //  console.log( resCat.length)
  let data = "";
  for (let i = 0; i < arr.length; i++) {
    data += `
        <div class="col-md-3">
        <div onclick="getCategoryMeal('${arr[i].strCategory}')"
        class="category position-relative overflow-hidden rounded-2">
            <img class="w-100" src="${arr[i].strCategoryThumb}"
                alt="">
            <div class="meal-layer bg-white position-absolute d-flex align-items-center flex-column ">
                <h3>${arr[i].strCategory}</h3>
                <p>${arr[i].strCategoryDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
            </div>
        </div>
    </div>
      `;
  }
  rowData.innerHTML = data;
}
// parameter from displayCategories Fun
async function getCategoryMeal(cat) {
  console.log(cat);
  //get category list
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
  );
  // let res = await fetch(`www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`) this link make error so
  // u need to add (https://) before ur api link
  res = await res.json();
  // console.log(res.meals);
  // console.log('hello from getcat ');

  displayMeals(res.meals.slice(0, 20));
}

// Area Code
$("#area").on("click", function () {
  innerLazyLoading()
  $(".searchContainer").addClass("d-none");
  $(".meals").removeClass("d-none");
  getAreas();
  closeNav();
});
// fetch data of categories and send it to displayCategories function
async function getAreas() {
  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list`)"
  );
  res = await res.json();
  res = await res.meals;
  // console.log(res[0]);
  displayAreas(res);
}
// parameter from getAreas Fun
function displayAreas(arr) {
  console.log(arr);
  let data = "";
  for (let i = 0; i < arr.length; i++) {
    data += `
        <div class="col-md-3">
        <div onclick="getAreaMeals('${arr[i].strArea}')"
          class=" text-center">
            <i class="text-white fa-solid fa-house-laptop fa-4x"></i>
            <h3 class="text-white">${arr[i].strArea}</h3>
        </div>
    </div>
      `;
  }
  rowData.innerHTML = data;
}
// parameter from displayAreas Fun
async function getAreaMeals(area) {
  console.log(area);
  // fetch area data and pass clicked data to api
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
  res = await res.json()
  console.log(res);
  displayMeals(res.meals.slice(0,20))
}

// ingredients section
$("#ingredients").on("click", function () {
  innerLazyLoading()
  $(".searchContainer").addClass("d-none");
  $(".meals").removeClass("d-none");
  getIngredients();
  closeNav();
});
async function getIngredients() {
  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list`)"
  );
  res = await res.json();
  res = await res.meals.slice(0, 20);
  // console.log(res );
  displayIngredients(res);
}
// parameter from getIngredients Fun
async function displayIngredients(arr) {
  console.log(arr);
  let data = "";
  for (let i = 0; i < arr.length; i++) {
    data += ` 
        <div onclick="getMealIngredint('${arr[i].strIngredient}')"
        class="col-md-3 text-center cursor-pointer">
        <i class="fa-solid fa-drumstick-bite fa-4x text-white"></i>
        <h3 class="text-white">${arr[i].strIngredient}</h3>
        <p class="text-white cursor-pointer">
        ${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}
        </p>
    </div>
      `;
  }
  rowData.innerHTML = data;
}
// parameter from displayIngredients Fun
async function getMealIngredint(ingredient){
  console.log(ingredient);
  // fetch api data filtering by ingrdient name 
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
  res = await res.json();
  console.log(res.meals);
  displayMeals(res.meals.slice(0,20))
}
// Search
$('#searchLetter').on('keyup',function(){
  // let letter = this.value;
  let letter = document.getElementById('searchLetter').value;
  let name = document.getElementById('searchName').value;
  console.log(letter);
  console.log(name);
  searchLetter(letter)
  searchName(name)
  $('.meals').removeClass('d-none')

})
$('#searchName').on('keyup',function(){
  // let letter = this.value;
  let name = document.getElementById('searchName').value;
  console.log(name);
  searchName(name)
  $('.meals').removeClass('d-none')

})



async function searchLetter(letter){
  console.log(letter);
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
  res = await res.json()
  console.log(res);
  displayMeals(res.meals);
  $('.meals').removeClass('d-none')
}
async function searchName(name){
  console.log(name);
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
  res = await res.json()
  console.log(res);
  displayMeals(res.meals);
  $('.meals').removeClass('d-none')
}




// contact
$("#contacts").on("click", function () {
  $('.searchContainer').addClass('d-none')
  $('.meals').removeClass('d-none')
  showContacts();
  closeNav();
});

function showContacts() {
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Special characters and numbers not allowed
              </div>
          </div>
          <div class="col-md-6">
              <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
              </div>
          </div>
          <div class="col-md-6">
              <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
              </div>
          </div>
          <div class="col-md-6">
              <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid age
              </div>
          </div>
          <div class="col-md-6">
              <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
          </div>
          <div class="col-md-6">
              <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid repassword 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div> `;
  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("focus",function(){
    nameInputTouched = true;
  });

  document.getElementById("emailInput").addEventListener("focus",function(){
    emailInputTouched = true;
  });

  document.getElementById("phoneInput").addEventListener("focus",function(){
    phoneInputTouched = true;
  });

  document.getElementById("ageInput").addEventListener("focus",function(){
    ageInputTouched = true;
  });

  document.getElementById("passwordInput").addEventListener("focus",function(){
    passwordInputTouched = true;
  });

  document.getElementById("repasswordInput").addEventListener("focus",function(){
    repasswordInputTouched = true;
  });
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

// validation

function inputsValidation() {
  if (nameInputTouched) {
    if (nameValidation()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (emailInputTouched) {
    if (emailValidation()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputTouched) {
    if (phoneValidation()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInputTouched) {
    if (ageValidation()) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputTouched) {
    if (passwordValidation()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (repasswordInputTouched) {
    if (repasswordValidation()) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    document.getElementById("emailInput").value
  );
}

function phoneValidation() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    document.getElementById("phoneInput").value
  );
}

function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
    document.getElementById("ageInput").value
  );
}

function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    document.getElementById("passwordInput").value
  );
}

function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}
