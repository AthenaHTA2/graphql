The endpoint for the graphiql: https://learn.01founders.co/graphiql
This is the link for fetch requests: https://learn.01founders.co/api/graphql-engine/v1/graphql 
graphql examples:
a)Godfrey Orlandi: https://magnificent-crumble-2b4f81.netlify.app/
b)Remi: https://rsmith-github.github.io/graphql/
c)Ricky: https://graphql-production-2b31.up.railway.app/
d) Jason Asante: https://jasonasantegql.netlify.app/

My skills pie chart was inspired by: https://www.youtube.com/watch?v=XEUCs7Sh8FI

step 1: In VSC terminal type: curl "https://learn.01founders.co/graphiql/api/graphql-engine/v1/
graphql" --data '{"query":"{user{715 AthenaHTA2}}"}'
step2: paste above query result into an html file and open it with live server
step3: make a note of all fields in each 01F table:
user table---> : id, login;
object table---> : campus, childrenAttrs, id, name, type, author, objects, progress, reference, results;
progress table---> : campus, createdAt, grade, id, isDone, object, objectId, path, results, updatedAt, user, userId;
result table---> : campus, createdAt, grade, groupId, object, objectId, path, type, updatedAt, user, userId;
transaction table---> : amount, createdAt, isBonus, object, objectId, path, type, user, userId;

step4: decide which data you need in order to build three sections from list below:
    - Basic user identification
    - XP amount
    - level
    - grades
    - audits
    - skills
step4: write some graphql queries to retrieve data, e.g.:
{
    user(where: { id: { _eq: 715 }}) {
      id
      login
    }
  
    	object{
    name
    type
    childrenAttrs
  }

  
    transaction(where: { userId: { _eq: 715 }}) {
      type
      amount
      objectId
      userId
      createdAt
      path
    }



 		progress(where: { userId: { _eq: 715 }}) {
      userId
      objectId
      grade
      createdAt
      updatedAt
  		path
    }
  
  		result(where: { userId: { _eq: 715 }}) {
      objectId
    	userId
      grade
    	type
      createdAt
      updatedAt
  		path
    }
}

/*Matt's graphql query:
{
  user (where: { id: { _eq: 715 }}){
			login
    transactions (where:{object:{type:{ _eq:"project"}}_and: {type:{_eq: "up"}}}){
      type
      amount
      objectId
      userId
      createdAt
      path
      object {
        name
      }
    }
  }
}

My queries
{
transaction(where:{object:{type:{ _eq:"project"}}_and: [{type:{_eq: "up"}}, {userId:{_eq: 715}}]}) {
  amount
  createdAt
  isBonus
  object{campus, id, name,type,author{id} }
  objectId
  userId
  path
  type
  userId
    }
}

{

object(where:{type:{_eq: "project"}_and:[{name:{_eq:"graphql"}},{campus:{_eq:"london"}}]}){
  	id
		name
  campus
  
  results{
    user{login}
    type
    grade
    objectId
    updatedAt
  }
  progresses{
    results{updatedAt}
    isDone
  }
  author{id,login}
}
}

{
  progress (where: { userId: { _eq: 715 }_and:{results:{grade:{_eq:1}}}}){
		userId
    objectId
    grade
    results{
      objectId
      userId
      createdAt
    	updatedAt
      path
    }
  }
}

/*=============this query works, it returns XP by transaction=============*/
query HelenaInformation{
  transaction(where:{userId:{_eq:715}_and:{type:{_eq:"xp"}}},order_by:{amount: desc}){
	...HelenaId
 	
  }
  }

fragment HelenaId on transaction{
  amount
  path
}

/*===========Kievon's query, haven't tested yet=====*/
transactions (where:{object:{type:{_eq:"project"}}_and:{type:{_in:"xp"}}}, order_by:{amount:desc})

Kievon: You will add type project to get only projects

/*================This query also works, returns xp for projects in descending order. Need to filter by type: "up"*/
query HelenaInformation{

  
  transaction(where:{userId:{_eq:715}_and:{type:{_eq:"xp"}_and:{object:{type:{_eq:"project"}}}}},order_by:{amount: desc}){
	...HelenaId
 	
  }
  }

fragment HelenaId on transaction{
  amount
  path
}

/*My query that returns xp per project. need to remove audits*/
query{
transaction(where:{object:{type:{_eq:"project"}}_and:{type:{_in:"xp"}_and:{userId:{_eq:715}}}}, order_by:{amount:desc}){
amount
  path
}

}

/*in progress*/
query{
transaction(where:{_and:[{object:{type:{_eq:"project"}}},{type:{_in:"xp"}},{userId:{_eq:715}}], {order_by:amount desc}}){
amount
  path
}

*/