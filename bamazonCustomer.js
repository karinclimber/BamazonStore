//npm installs 
var mysql = require('mysql'); 
var colors = require('colors/safe');
var inquirer = require('inquirer');
var Table = require('easy-table');
var confirm = require('inquirer-confirm');

//create connection to mysql through a root with a password
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'sqlpass',
    database: 'bamazon'
})

//connect to mysql, once connected run the start function 
connection.connect(function(err) {
    if (err) throw err;
    start();
});

//start function 
function start() {
    connection.query("SELECT * FROM products", function (err, result, fields) {
        if (err) throw err;
        var data = result;
        var t = new Table
        
       data.forEach(function(products) {
         t.cell('Item ID Number', products.item_id)
         t.cell('Product Name', products.product_name)
         t.cell('Department Name', products.department_name)
         t.cell('Price, USD', products.price)
         t.cell('Stock Quantity',  products.stock_quantity)
         t.newRow()
       })
        
       console.log(colors.rainbow(t.toString()));
//prompt user for ID number   
inquirer.prompt(
        {
          type: 'input',
          name: 'itemID',
          message: 'What is the ID Number of the item that you would like to buy?',
  //grab product name based off of user input of ITEM ID     
        }).then(function(answer) {
        // console.log(answer.itemID);
          connection.query("SELECT * FROM products WHERE ?", {item_id: answer.itemID}, function(err, res) {
            if (err) throw (err);
            
            console.log("You chose " + res[0].product_name + " for " + "$" + res[0].price + "!");
            var chosenItem = answer.itemID;
            //add validate
            //  { console.log("Sorry I don't recognize that number, please give a valid Item_ID")}
            // console.log(chosenItem);
            
//prompt user for a quantity     
      inquirer.prompt(
        {
          type: 'input',
          name: 'quantity',
          message: 'How many would you like?',
        }).then(function(answer){
          console.log("Great! You chose to buy " + answer.quantity + ", " + "let me check my inventory.");
//take a few seconds to pretend to "check" inventory, compare with database       
          var timer = setTimeout(checkInventory, 2000)
             function checkInventory() {
               connection.query("SELECT * FROM products WHERE ?", {item_id: chosenItem}, function(err, res){
                if (err) throw (err);
                if (res[0].stock_quantity >= answer.quantity) {
                  console.log(colors.blue("It looks like we have plenty."));
                  console.log(colors.green("Including tax, your total is " + "$" + (1.07*(parseInt(answer.quantity)*parseInt(res[0].price))).toFixed(2) + "!"));
                  confirm("Do you want to proceed with your order?")
                  .then(function confirmed() {
                    console.log("Great!! Enjoy your new " + res[0].product_name + "!");
                    // console.log(res[0].product_name);
                    var newStock = (parseInt(res[0].stock_quantity)) - (parseInt(answer.quantity));
                    // console.log(newStock);
                  connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newStock}, {product_name: res[0].product_name}], function(err, res){
                    var timer2 = setTimeout(start, 2000)
                    if (err) throw err;
                  })
                  }, function cancelled() {
                    console.log("Sorry to hear that. Please come back when you are ready!")
                    var timer2 = setTimeout(start, 2000)
                  })
                
                } else {
                  console.log(colors.red("Sorry, we don't have enough! We only have " + res[0].stock_quantity + "." + " Would you like to buy " + res[0].stock_quantity + "?"));
                  confirm("Do you want to proceed with this order?")
                  .then(function confirmed() {
                    console.log(colors.green("Including tax, your total is " + "$" + (1.07*(parseInt(res[0].stock_quantity)*parseInt(res[0].price))).toFixed(2) + "!"));
                    console.log(colors.blue("Enjoy your new " + res[0].product_name + "!"));
                  connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: 0}, {product_name: res[0].product_name}], function(err, res){
                      var timer2 = setTimeout(start, 2000)
                  }, function cancelled() {
                    console.log(colors.red("Sorry to hear that. Please come back when you are ready!"));
                    var timer2 = setTimeout(start, 2000)
                  })
                })
               }
            })
          }
    })
   })
})
    })
}

