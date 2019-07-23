const restaurants = document.querySelector("#menuData").children;

const listRestauarants = function() {
    for (let x = 0; x < restaurants.length; x += 1) {
        let eachRest = restaurants[x].getAttribute("restaurant");
        console.log(eachRest)
    }
}

listRestauarants();

window.onload = function() {

    
    /*
        10 populate list of restaurants
            11 read xml
            12 store array of ALL restaurants in variable
            13 template literal - create inputs
            14 display inputs in html
            15 create submit button - press enter or click SUBMIT
            16 await further instructions
            17 listen for enter or click
            18 remove button ???
            19 return input GOTO 20
        20 populate list of meal options
            21 read SELECTED menus. by array #???
            22 scan for meal attributes - removing duplicates - return and store
            23 template literal - create inputs (add price cap option as well)
            24 display inputs
            25 create button - press enter or click SUBMIT - ?you may change your restaurant selection too?
            26 listen for enter or click
            27 return input and store GOTO 30
        30 build and display table
            31 
        40 if no result, say "my youre picky, well it looks like (other restaurant) has what youre looking for"
            41 read xml of reataurants not selected, ingoring others
            42 GOTO 30
    */
}