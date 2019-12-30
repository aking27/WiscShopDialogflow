// import React from 'react';

const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const app = express()
const fetch = require('node-fetch')
const base64 = require('base-64')

let username = "";
let password = "";
let token = "";
let category = "";
let InfoOfThisProduct = "";
let InfoOfThisProductID = "";
let productInformation = "";
let productReview = "";
let categoryTags = "";
let cartContents = "";
let tag = "";

async function getToken () {
  let request = {
    method: 'GET',
    headers: {'Content-Type': 'application/json',
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    redirect: 'follow'
  }

  const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/login',request)
  const serverResponse = await serverReturn.json()
  token = serverResponse.token

  return token;
}
async function navigateHome(){
  let requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token,
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    body: "{\n	\"page\": \"/" + username + "\"\n}",
    redirect: 'follow'
  }
  try{
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application', requestOptions);
    const serverResponse = await serverReturn.json();
  } catch {
    console.log(error);
  }
}

async function navigatePage(){
  let requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token,
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    body: "{\n	\"page\": \"/" + username + "/" + category + "\"\n}",
    redirect: 'follow'
  }
  try{
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application', requestOptions);
    const serverResponse = await serverReturn.json();
    category = serverResponse.category

    return category;
  } catch {
    console.log(error);
  }
}

async function getProductID(){ 
  let requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token,
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    redirect: 'follow'
  }
  try{
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/products', requestOptions);
    const serverResponse = await serverReturn.json();
    for(let i = 0; i < serverResponse.products.length; i++){
      if(serverResponse.products[i].name == InfoOfThisProduct){
        InfoOfThisProductID = serverResponse.products[i].id
      }
    }
  } catch {
    console.log(error);
  }
}

async function getProductInformation(){
  let requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token,
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    redirect: 'follow'
  }
  try{
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/products/' + InfoOfThisProductID, requestOptions);
    const serverResponse = await serverReturn.json();

    productInformation = serverResponse.description;
  } catch {
    console.log(error);
  }  
}

async function getProductReview(){ // I already have the product ID function created 
  let requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token,
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    redirect: 'follow'
  }
  try{
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/products/' + InfoOfThisProductID + '/reviews', requestOptions);
    const serverResponse = await serverReturn.json();
    for(let i = 0; i < serverResponse.reviews.length; i++){
      productReview = serverResponse.reviews[i].text
    }
  } catch {
    console.log(error);
  } 
}

async function getCategoryTags(){ // /categories/<category_title>/tags
  let requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json',
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    redirect: 'follow'
  }
  try{
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/categories/'+ category +'/tags', requestOptions);
    const serverResponse = await serverReturn.json();
    categoryTags = serverResponse.tags
  } catch {
    console.log(error);
  }     
}

async function getCartInfo(){
  let requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token,
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    redirect: 'follow'
  }
  let totalCost = 0;
  let itemCount = 0;
  try{
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/products', requestOptions);
    const serverResponse = await serverReturn.json();
    for(let a = 0; a < serverResponse.products.length; a++){
      for(let b = 0; b < serverResponse.products[a].count; b++){
        itemCount += 1;
      }
    }
    cartContents = "\nNumber of item(s) in cart: " + itemCount + ","
    for(let i = 0; i < serverResponse.products.length; i++){
      var temp = i + 1
      console.log(serverResponse.products[i].name)
      cartContents += "\nItem " + temp + ": " + serverResponse.products[i].name + ","
      
      if(serverResponse.products[i].count == 1){ // need to multiply cost since there is more than 1
        totalCost += serverResponse.products[i].price
      } else {
        for(let j = 0; j < serverResponse.products[i].count; j++){
          totalCost += serverResponse.products[i].price
        }
      }    
    }
    cartContents += "\nTotal: $" + totalCost
  } catch {
    console.log(error);
  }   
}

async function addToCart(){
  console.log(InfoOfThisProductID)
  let requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token,
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    redirect: 'follow'
  }
  try{
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/products/' + InfoOfThisProductID, requestOptions);
    const serverResponse = await serverReturn.json();
  } catch {
    console.log(error);
  }
}
async function removeFromCart(){
  let requestOptions = {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token,
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    redirect: 'follow'
  }
  try{
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/products/' + InfoOfThisProductID, requestOptions);
    const serverResponse = await serverReturn.json();
  } catch {
    console.log(error);
  }
}

async function navigateCartReview(){// /<username>/cart-review
  let requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token,
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    body: "{\n	\"page\": \"/" + username + "/cart-review\"\n}",
    redirect: 'follow'
  }
  try{
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application', requestOptions);
    const serverResponse = await serverReturn.json();
  } catch {
    console.log(error);
  }
}

async function addTag(){
  let requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token,
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    redirect: 'follow'
  }
  try{
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/tags/' + tag, requestOptions);
    const serverResponse = await serverReturn.json();
  } catch {
    console.log(error);
  }
}

app.get('/', (req, res) => res.send('online'))
app.post('/', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  function welcome () {
    // agent.add('Webhook works!')
  }

  async function login () { // want to navigate to the home screen after logging in
    // You need to set this from `username` entity that you declare in DialogFlow
    username = agent.parameters.Username
    // You need to set this from password entity that you declare in DialogFlow
    password = agent.parameters.Password
    await getToken()
    await navigateHome()
    
    // agent.add(token)
    // agent.add('here')
    console.log("Username: " + agent.parameters.Username + "Password: " + agent.parameters.Password)
    // agent.add()
  }

  /*TODO: navigate to each category
    show product information for each item -- need to go into dialogflow and rename things to how they appear on the server
            example--- hat to Wisconsin Football Hat
    Get the product reviews
    Add items to the cart
    I already have a function that can get the product ID if the product name is given from dialogflow -- so this shouldn't be too bad


    check the flow of logging in
    Harder stuff: tags, cart stuff, messages (last thing -- not much points -- server is application/messages)
  */

  async function navigateHats () {
    category = 'hats'
    // color = agent.parameters.color
    await navigatePage()
  }
  async function navigateSweatshirts () {
    category = 'sweatshirts'
    await navigatePage()
  }
  async function navigatePlushes () {
    category = 'plushes'
    await navigatePage()
  }
  async function navigateLeggings () {
    category = 'leggings'
    await navigatePage()
  }
  async function navigateTees() {
    category = 'tees'
    await navigatePage()
  }
  async function navigateBottoms() {
    category = 'bottoms'
    await navigatePage()
  }
  async function homepage(){
    await navigateHome()
  }

  async function hatInformation () {
    InfoOfThisProduct = agent.parameters.hats    
    await getProductID()
    await getProductInformation()
    agent.add(productInformation)
  }
  async function sweatshirtInformation () {
    InfoOfThisProduct = agent.parameters.Sweatshirts    
    await getProductID()
    await getProductInformation()
    agent.add(productInformation)
  }
  async function plushesInformation() {
    InfoOfThisProduct = agent.parameters.Plushes    
    await getProductID()
    await getProductInformation()
    agent.add(productInformation)
  }
  async function leggingsInformation () {
    InfoOfThisProduct = agent.parameters.Leggings    
    await getProductID()
    await getProductInformation()
    agent.add(productInformation)
  }
  async function teesInformation () {
    InfoOfThisProduct = agent.parameters.Tees    
    await getProductID()
    await getProductInformation()
    agent.add(productInformation)
  }
  async function bottomsInformation () {
    InfoOfThisProduct = agent.parameters.Bottoms    
    await getProductID()
    await getProductInformation()
    agent.add(productInformation)
  }
  


  async function getHatReview(){
    InfoOfThisProduct = agent.parameters.hats
    console.log(agent.parameters)
    await getProductID()
    await getProductReview()
    agent.add(productReview)
  }
  async function getSweatshirtReview(){
    InfoOfThisProduct = agent.parameters.Sweatshirts
    console.log(agent.parameters)
    await getProductID()
    await getProductReview()
    agent.add(productReview)
  }
  async function getPlushesReview(){
    InfoOfThisProduct = agent.parameters.Plushes
    console.log(agent.parameters)
    await getProductID()
    await getProductReview()
    agent.add(productReview)
  }
  async function getLeggingsReview(){
    InfoOfThisProduct = agent.parameters.Leggings
    console.log(agent.parameters)
    await getProductID()
    await getProductReview()
    agent.add(productReview)
  }
  async function getTeesReview(){
    InfoOfThisProduct = agent.parameters.Tees
    console.log(agent.parameters)
    await getProductID()
    await getProductReview()
    agent.add(productReview)
  }


  async function queryTags(){
    category = agent.parameters.Categories
    console.log(category)
    await getCategoryTags()
    agent.add(categoryTags)
  }

  async function queryCart(){
    await getCartInfo()
    agent.add(cartContents)
  }

  async function addHat(){
    category = 'hats'
    InfoOfThisProduct = agent.parameters.hats 
    await getProductID()
    await addToCart()
  }
  async function addSweatshirt(){
    category = 'sweatshirts'
    InfoOfThisProduct = agent.parameters.Sweatshirts 
    await getProductID()
    await addToCart()
  }
  async function addPlushes(){
    category = 'plushes'
    InfoOfThisProduct = agent.parameters.Plushes 
    await getProductID()
    await addToCart()
  }
  async function addLeggings(){
    category = 'leggings'
    InfoOfThisProduct = agent.parameters.Leggings 
    await getProductID()
    await addToCart()
  }
  async function addTees(){
    category = 'tees'
    InfoOfThisProduct = agent.parameters.Tees 
    await getProductID()
    await addToCart()
  }
  async function addBottoms(){
    category = 'bottoms'
    InfoOfThisProduct = agent.parameters.Bottoms 
    await getProductID()
    await addToCart()
  }

  async function removeHat(){
    category = "hats"
    InfoOfThisProduct = agent.parameters.hats
    await getProductID()
    await removeFromCart()
  }
  async function removeSweatshirts(){
    category = "sweatshirts"
    InfoOfThisProduct = agent.parameters.Sweatshirts
    await getProductID()
    await removeFromCart()
  }
  async function removePlushes(){
    category = "plushes"
    InfoOfThisProduct = agent.parameters.Plushes
    await getProductID()
    await removeFromCart()
  }
  async function removeLeggings(){
    category = "leggings"
    InfoOfThisProduct = agent.parameters.Leggings
    await getProductID()
    await removeFromCart()
  }
  async function removeTees(){
    category = "tees"
    InfoOfThisProduct = agent.parameters.Tees
    await getProductID()
    await removeFromCart()
  }
  async function removeBottoms(){
    category = "bottoms"
    InfoOfThisProduct = agent.parameters.Bottoms
    await getProductID()
    await removeFromCart()
  }

  async function reviewCart(){
    await navigateCartReview()
  }

  async function addHatTag(){
    tag = agent.parameters.HatTag
    await addTag()
  }
  async function addSweatshirtTag(){
    tag = agent.parameters.SweatshirtTag
    await addTag()
  }
  // async function addPlushesTag(){
  //   tag = agent.parameters.PlushesTag
  //   await addTag()
  // }
  // async function addLeggingsTag(){
  //   tag = agent.parameters.LeggingsTag
  //   await addTag()
  // }


  let intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome)

  intentMap.set('Login', login) 
  intentMap.set('NavigateHats', navigateHats)
  intentMap.set('NavigateSweatshirts', navigateSweatshirts)
  intentMap.set('NavigatePlushes', navigatePlushes)
  intentMap.set('NavigateLeggings', navigateLeggings)
  intentMap.set('NavigateTees', navigateTees)
  intentMap.set('NavigateBottoms', navigateBottoms)
  intentMap.set('NavigateHome', homepage)

  intentMap.set('GetHatReview', getHatReview)
  intentMap.set('GetSweatshirtReview', getSweatshirtReview)
  intentMap.set('GetPlushesReview', getPlushesReview)
  intentMap.set('GetLeggingsReview', getLeggingsReview)
  intentMap.set('GetTeesReview', getTeesReview)
  // intentMap.set('GetBottomsReview', getBottomsReview) -- there aren't any reviews 

  intentMap.set('HatInfo', hatInformation)
  intentMap.set('SweatshirtInfo', sweatshirtInformation)
  intentMap.set('PlushesInfo', plushesInformation)
  intentMap.set('LeggingsInfo', leggingsInformation)
  intentMap.set('TeesInfo', teesInformation)
  intentMap.set('BottomsInfo', bottomsInformation)

  intentMap.set('QueryTags', queryTags)
  intentMap.set('QueryCart', queryCart)

  intentMap.set('AddHat', addHat)
  intentMap.set('AddSweatshirt', addSweatshirt)
  intentMap.set('AddPlushes', addPlushes)
  intentMap.set('AddLeggings', addLeggings)
  intentMap.set('AddTees', addTees)
  intentMap.set('AddBottoms', addBottoms)

  intentMap.set('RemoveHat', removeHat)
  intentMap.set('RemoveSweatshirts', removeSweatshirts)
  intentMap.set('RemovePlushes', removePlushes)
  intentMap.set('RemoveLeggings', removeLeggings)
  intentMap.set('RemoveTees', removeTees)
  intentMap.set('RemoveBottoms', removeBottoms)

  intentMap.set('ReviewCart', reviewCart)

  intentMap.set('AddHatTag', addHatTag)
  intentMap.set('AddSweatshirtTag', addSweatshirtTag)
  // intentMap.set('AddPlushesTag', addPlushesTag)
  // intentMap.set('AddLeggingsTag', addLeggingsTag)
  // intentMap.set('AddSweatshirtTag', addSweatshirtTag)
  // intentMap.set('AddSweatshirtTag', addSweatshirtTag)

  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080)