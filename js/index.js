let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;

closeSideNav();
$(".side-nav-menu i.open-close-icon").click( function(){
    if ($(".side-nav-menu").css("left") == "0px") {
        closeSideNav()
        $(".open-close-icon").addClass("fa-align-justify");
        $(".open-close-icon").removeClass("fa-x");
    } else {
        openSideNav()
        $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");
    }
})
$(document).ready(function () {

    searchByName("").then(() => {
        $("#loading-screen").fadeOut(500);
        
        $("body").css("overflow", "visible");

    })
    
});
function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth()
    $(".side-nav-menu").animate({
        left: -boxWidth
    }, 500)

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");


    $(".links li").animate({
        top: 300
    }, 500)
}
function openSideNav() {
    $(".side-nav-menu").animate({
        left: 0
    }, 500)


    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");


    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}
function displayMeals(meals) {
    let cartoona = "";
    closeSideNav();
    for (let i = 0; i < meals.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${meals[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meals[i].strMealThumb}" alt="" >
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meals[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona
}
async function getMealDetails(meal){
    closeSideNav();
    rowData.innerHTML=``;
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML=``;
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
    response= await response.json();
    // console.log(response);
    displayMealDetails(response.meals[0]);
    $(".inner-loading-screen").fadeOut(300);

}
function displayMealDetails(meal){
    searchContainer.innerHTML='';
    rowData.innerHTML='';
    let mealData=``;
    for(let i=1; i<=20; i++){
        if(meal[`strIngredient${i}`]){
            mealData +=`
            <li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${mealData}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = cartoona

}
async function searchByName(term) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}
function showSearchForm(){
    searchContainer.innerHTML=`
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFletter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`;
    rowData.innerHTML=``;
}
$("#search").click(function(){
    showSearchForm();
    closeSideNav();
})
async function searchByFletter(term) {
    closeSideNav()
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300)
    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}

async function getCategorys(){
    rowData.innerHTML="";
    $(".inner-loading-screen").fadeIn(300);
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response= await response.json();
    // console.log(response);
    displaycategory(response.categories);
    $(".inner-loading-screen").fadeOut(300);

}
function displaycategory(category) {
    let cartoona = "";

    for (let i = 0; i < category.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${category[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${category[i].strCategoryThumb}" alt="" >
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${category[i].strCategory}</h3>
                        <p>${category[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona
}
$('#categoris').click(function() {
    getCategorys()
})
async function getCategoryMeals(category){
    rowData.innerHTML=``;
    $(".inner-loading-screen").fadeIn(300)

    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response= await response.json();
    displayMeals(response.meals.slice(0,20));
    $(".inner-loading-screen").fadeOut(300)


}


async function getArea() {
    rowData.innerHTML = ``;
    $(".inner-loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    response = await response.json()
    console.log(response);

    displayArea(response.meals)
    $(".inner-loading-screen").fadeOut(300)

}
$('#area').click(function () {
    getArea();
  })

function displayArea(areas) {
    let cartoona = "";

    for (let i = 0; i < areas.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${areas[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${areas[i].strArea}</h3>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona
}

// getAreaMeals
async function getAreaMeals(area){
    rowData.innerHTML=``;
    $(".inner-loading-screen").fadeIn(300);

    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    response= await response.json();
    displayMeals(response.meals.slice(0,20));
    $(".inner-loading-screen").fadeOut(300);
}


async function getIngrediants() {
    rowData.innerHTML = ``;
    $(".inner-loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    response = await response.json()
    console.log(response);

    displayIngrediants(response.meals.slice(0,20));
    $(".inner-loading-screen").fadeOut(300)

}
$('#ingrediants').click(function () {
    getIngrediants();
  })

function displayIngrediants(ingrediant) {
    let cartoona = ``;

    for (let i = 0; i < ingrediant.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getIngrediantMeals('${ingrediant[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingrediant[i].strIngredient}</h3>
                        <p>${ingrediant[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona
}

// // getIngrediantMeals
async function getIngrediantMeals(ingrediant){
    rowData.innerHTML=``;
    $(".inner-loading-screen").fadeIn(300);

    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediant}`);
    response= await response.json();
    displayMeals(response.meals.slice(0,20));
    $(".inner-loading-screen").fadeOut(300);
}
// contact form

function  contactForm() {
    rowData.innerHTML=`
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="name" onkeyup="ValidName(); formValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="email" onkeyup="ValidEmail(); formValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@xxx.com
                </div>
            </div>
            <div class="col-md-6">
                <input id="phone" onkeyup="ValidPhone(); formValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="age" onkeyup="ValidAge(); formValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="password" onkeyup="ValidAge(); formValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repassword" onkeyup="ValidRepassword(); formValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
submitBtn = document.getElementById("submitBtn");
}

$('#contact').click(function(){
    contactForm();
})
function ValidName() {
    if (/^[a-zA-Z'-]+$/.test(document.getElementById("name").value)) {
        document.getElementById("nameAlert").classList.replace("d-block", "d-none");
        return true;

    } else {
        document.getElementById("nameAlert").classList.replace("d-none", "d-block");
        return false

    }
}

function ValidEmail() {
    if (/^[\w.-]+@[\w.-]+\.[\w-]+(\.[\w-]+)*$/.test(document.getElementById("email").value)) {
        document.getElementById("emailAlert").classList.replace("d-block", "d-none");
        return true
    } else {
        document.getElementById("emailAlert").classList.replace("d-none", "d-block");
        return false;

    }
}

function ValidPhone() {
    if (/^\+?[0-9][0-9.-]{8,15}[0-9]/.test(document.getElementById("phone").value)) {
        document.getElementById("phoneAlert").classList.replace("d-block", "d-none");
        return true
    } else {
        document.getElementById("phoneAlert").classList.replace("d-none", "d-block");
        return false;

    }
}

function ValidAge() {
    if (/^[1-9]?[0-9]{1}$|^100$/.test(document.getElementById("age").value)) {
        document.getElementById("ageAlert").classList.replace("d-block", "d-none");
        return true;
    } else {
        document.getElementById("ageAlert").classList.replace("d-none", "d-block")
        return false;

    }
}

function ValidPassword() {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{6,15}$/.test(document.getElementById("password").value)) {
        document.getElementById("passwordAlert").classList.replace("d-block", "d-none");
        return true;
    } else {
        document.getElementById("passwordAlert").classList.replace("d-none", "d-block");
        return false;

    }
}

function ValidRepassword() {
    if (document.getElementById("repassword").value == document.getElementById("password").value) {
        document.getElementById("repasswordAlert").classList.replace("d-block", "d-none");
        return true;
    } else {
        document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")
        return false;

    }
}

function formValidation(){
  if (ValidName() &&
        ValidEmail() &&
        ValidPhone() &&
        ValidAge() &&
        ValidPassword() &&
        ValidRepassword()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}



















