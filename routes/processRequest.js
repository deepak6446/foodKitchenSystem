const Order  		= require('../models/order.js')
const setting 		= require('../config/setting')
const Q 			= require('q')
const io 			= require('../app.js')

search 	= {

	//get list of orders on init
	getOrders : (req, res) => {
		Order.find({}, (err, data) => {
			
			if(err) console.log('err in getOrders', err)

			if(err||!data.length) json = { status:0, message: "Error Getting Order"}
			else json = { status:1, data: data, message: "Updated Data"}

			if(req == 'isEmit') {
				console.log('emmited')
				io.io.emit('status', json);
			}else {
				res.send(json)
				res.end()
			}

		})

	},

	//update order by clicking submit button
	orderCreated : (req, res) => {
		let json = {}

		if(req.body.id && req.body.quantity) {

			Order.findOne({_id: req.body.id}, (e, d) => {
				
				if (d.quantity >= req.body.quantity) {
					d.quantity = d.quantity - req.body.quantity
					d.created  = d.created + req.body.quantity
					d.save((err, data) => {
						console.log('orderCreated Error:', err)
						
						if(err) json = { status:0, message: "Error Updating Order"}
						else json = { status:1, data: data, message: "Updated Data"}
						search.getOrders('isEmit')
						res.send(json)
						res.end()
					})

				}else {
					json = { status:0, message: "Error Updating Order"}
					search.getOrders('isEmit')
					res.send(json)
					res.end()
				}

			})
			
		}else {
			res.send({status:0, message: "Invalid Request"})
			res.end()
		}
	},

	//API to place an order with quantity, upon which the product is appended to the kitchen display system page
	createOrder : (req, res) => {
		console.log(req.body)
		
		Order.update({name: req.body.name}, {$set: {quantity: req.body.quantity}}, (err, data) => {
			
			if(err) console.log('err in createOrder', err)

			if(err||!data) json = { status:0, message: "Error Creating Order"}
			else {
				console.log(data)
				json = { status:1, message: "Order Created"}
				search.getOrders('isEmit')
			}

			res.send(json)
			res.end()

		})

	},

	//API for Setting up Predicted values for each dish
	setPredicted : (req, res) => {
		console.log(req.body)
		Order.update({name : req.body.name}, {predicted : req.body.predicted}, (err, data) => {
			console.log(data)
			if(err) console.log('err in createOrder', err)

			if(err||!data) json = { status:0, message: "Error Creating Order"}
			else {
				console.log(data)
				json = { status:1, message: "Order Created"}
				search.getOrders('isEmit')
			}

			res.send(json)
			res.end()

		})

	},


}

module.exports = search