01F JavaScript project #3: Graphql

Project APIs: graphiql: https://learn.01founders.co/graphiql fetch requests: https://learn.01founders.co/api/graphql-engine/v1/graphql

Project road-map:

step 1: In VSC terminal type: curl "https://learn.01founders.co/graphiql/api/graphql-engine/v1/graphql" --data '{"query":"{user{userid login}}"}'

step2: paste above query result into an html file and open it with live server

step3: make a note of all fields from each 01F table:

user table---> : id, login; object table---> : campus, childrenAttrs, id, name, type, author, objects, progress, reference, results; progress table---> : campus, createdAt, grade, id, isDone, object, objectId, path, results, updatedAt, user, userId; result table---> : campus, createdAt, grade, groupId, object, objectId, path, type, updatedAt, user, userId; transaction table---> : amount, createdAt, isBonus, object, objectId, path, type, user, userId; step4: decide which data you need in order to build three sections from list below: - Basic user identification - XP amount - level - grades - audits - skills

step4: write some graphql queries to retrieve data. step5: write svg code to graph data.

Below is my graphql query, used for: profile data, projects' details, XP by project line graph, %points by skill pie chart API: https://learn.01founders.co/api/graphql-engine/v1/graphql

{ user(where: {login: {_eq: "login"}}) { ...HelenaId }

progress(
  where: {_and: [{user: {login: {_eq: "login"}}}, {object: {type: {_eq: "project"}}}, {isDone: {_eq: true}}, {grade: {_neq: 0}}]}
  order_by: {updatedAt: desc}
  
) {
  ...HelenaProgress
}
transaction(
  where: {_and: [{user: {login: {_eq: "login"}}}, {object: {type: {_eq: "project"}}}, {type: {_eq: "xp"}}]}
  order_by: {amount:desc} 
) {
  ...HelenaXP
}
tasksTypes:  transaction(where: { userId: { _eq: userid }, type: {_like: "%skill%"}}){
    type
    amount
  }
