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

inquirer.prompt({
	type: 'list',
	name: 'toDo',
	message: 'What would you like to do?',
	choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
}).then(function(answers){
	if (answers.toDo === "View Products for Sale") {
		showTable();
	} else if (answers.toDo === "View Low Inventory") {
		lowInventory();
	} else if (answers.toDo === "Add to Inventory") {
				
	} if (answers.toDo === "Add New Product") {
						
	} else {
		var timer = setTimeout(start, 3000);
	}
})	
//post table of data
function showTable() {
	connection.query("SELECT * FROM products", function(err, result, fields) {
		if (err) throw err;
		var data = result;
		var t = new Table
		data.forEach(function(products) {
			t.cell('Item ID Number', products.item_id)
			t.cell('Product Name', products.product_name)
			t.cell('Department Name', products.department_name)
			t.cell('Price, USD', products.price)
			t.cell('Stock Quantity', products.stock_quantity)
			t.newRow()
		})
		console.log(colors.rainbow(t.toString()));
	})
};

function lowInventory() {
	connection.query("SELECT * FROM products", function(err,res) {
		if (err) throw err;
		for (var i = 0; i < res.length ; i ++) {
				if (res[i].stock_quantity <= 5) {
			console.log([res[i].product_name, res[i].stock_quantity]);
			
		} else {
			console.log("boogers")
		}
	}
	})
}
	
	// connection.query("SELECT * FROM products WHERE ?", {stock_quantity: 1}, function(err, res) {
	// 	var newArr = arr.push(res);
	// console.log(newArr);
	// })
	
	

	// connection.query("SELECT * FROM products WHERE ?", {
	// 		}, function(err, res) {
	// 			if (err) throw (err);
	// 			console.log("You chose to update " + res[0].product_name + ".");
	// 			var chosenItem = answer.itemID;
	// 			inquirer.prompt({
	// 				type: 'input',
	// 				name: 'quantity',
	// 				message: 'How many would you like to add?',
	// 			}).then(function(answer) {
	// 				console.log(colors.blue("Great! You chose to add " + answer.quantity + "."));
	// 				confirm("Do you want to proceed with this update?").then(function confirmed() {
	// 					console.log(colors.green("Great! I have updated " + res[0].product_name + "!"));
	// 					// console.log(res[0].product_name);
	// 					var newStock = (parseInt(res[0].stock_quantity)) + (parseInt(answer.quantity));
	// 					// console.log(newStock);
	// 					connection.query("UPDATE products SET ? WHERE ?", [{
	// 						stock_quantity: newStock
	// 					}, {
	// 						product_name: res[0].product_name
	// 					}], function(err, res) {
	// 						var timer2 = setTimeout(start, 2000)
	// 						if (err) throw err;
	// 					})
	// 				}, function cancelled() {
	// 					console.log("Okay, let me know when you are ready!")
	// 					var timer2 = setTimeout(start, 2000)
				// 	})
				// })
			// })
}