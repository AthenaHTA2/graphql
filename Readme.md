01F JavaScript project #3: Graphql

Project inputs:
The endpoint for the graphiql: https://learn.01founders.co/graphiql
This is the link for fetch requests: 
https://learn.01founders.co/api/graphql-engine/v1/graphql


Project tasks:

step 1: 
In VSC terminal type: curl "https://learn.01founders.co/graphiql/api/graphql-engine/v1/graphql" --data '{"query":"{user{userid login}}"}'

step2: paste above query result into an html file and open it with live server

step3: 
make a note of all fields in each 01F table:

user table---> : id, login;

object table---> : campus, childrenAttrs, id, name, type, author, objects, progress, reference, results;

progress table---> : campus, createdAt, grade, id, isDone, object, objectId, path, results, updatedAt, user, userId;

result table---> : campus, createdAt, grade, groupId, object, objectId, path, type, updatedAt, user, userId;

transaction table---> : amount, createdAt, isBonus, object, objectId, path, type, user, userId;

step4: 
decide which data you need in order to build three sections from list below:
    - Basic user identification
    - XP amount
    - level
    - grades
    - audits
    - skills

step4: write some graphql queries to retrieve data.

step5: write svg code to graph data.

My graphql query:

the API: https://learn.01founders.co/api/graphql-engine/v1/graphql
my graphql query, used for profile data, projects' details,  
XP by project line graph, XP by task pie chart.

{
    user(where: {login: {_eq: "AthenaHTA2"}}) {
			...HelenaId
    }
  
 
    progress(
      where: {_and: [{user: {login: {_eq: "AthenaHTA2"}}}, {object: {type: {_eq: "project"}}}, {isDone: {_eq: true}}, {grade: {_neq: 0}}]}
      order_by: {updatedAt: desc}
      
    ) {
      ...HelenaProgress
    }
    transaction(
      where: {_and: [{user: {login: {_eq: "AthenaHTA2"}}}, {object: {type: {_eq: "project"}}}, {type: {_eq: "xp"}}]}
      order_by: {amount:desc} 
    ) {
      ...HelenaXP
    }
    tasksTypes:  transaction(where: { userId: { _eq: 715 }, type: {_like: "%skill%"}}){
        type
        amount
      }
}
 fragment HelenaId on user{
  login
  id
}

fragment HelenaProgress on progress{
    id
    grade
    createdAt
    updatedAt
    object {
    id
    name
    campus
    }
  }
  
  fragment HelenaXP on transaction{
    amount
    createdAt
    object {
          id
          name
        }
  }

Graphql projects by other students:

a)Godfrey Orlandi: https://magnificent-crumble-2b4f81.netlify.app/
b)Remi: https://rsmith-github.github.io/graphql/
c)Ricky: https://graphql-production-2b31.up.railway.app/
d) Jason Asante: https://jasonasantegql.netlify.app/

