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
		inquirer.prompt({
			type: 'input',
			name: 'itemID',
			message: 'What is the ID Number of the item that you would like to update?',
			//grab product name based off of user input of ITEM ID     
		}).then(function(answer) {
			// console.log(answer.itemID);
			connection.query("SELECT * FROM products WHERE ?", {
				item_id: answer.itemID
			}, function(err, res) {
				if (err) throw (err);
				console.log("You chose to update " + res[0].product_name + ".");
				var chosenItem = answer.itemID;
				inquirer.prompt({
					type: 'input',
					name: 'quantity',
					message: 'How many would you like to add?',
				}).then(function(answer) {
					console.log(colors.blue("Great! You chose to add " + answer.quantity + "."));
					confirm("Do you want to proceed with this update?").then(function confirmed() {
						console.log(colors.green("Great! I have updated " + res[0].product_name + "!"));
						// console.log(res[0].product_name);
						var newStock = (parseInt(res[0].stock_quantity)) + (parseInt(answer.quantity));
						// console.log(newStock);
						connection.query("UPDATE products SET ? WHERE ?", [{
							stock_quantity: newStock
						}, {
							product_name: res[0].product_name
						}], function(err, res) {
							var timer2 = setTimeout(start, 2000)
							if (err) throw err;
						})
					}, function cancelled() {
						console.log("Okay, let me know when you are ready!")
						var timer2 = setTimeout(start, 2000)
					})
				})
			})
		})
	})
}