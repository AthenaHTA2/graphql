/*to run in node
import { JSDOM as _JSDOM } from "jsdom";
var JSDOM = _JSDOM;
global.document = new JSDOM("html://localhost:5500").window.document;*/


//===========> I partly used the 'Postman' appication to build the below 'Javascript Fetch: <=======
// the array of IT skills objects
var SkillObjects = []
var allSkills = 0
// the IT skills drop-down selection box
let SelectSkill = document.getElementById("Skills")

// fetch starts here
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var graphql = JSON.stringify({
  query: "{\n    user(where: {login: {_eq: \"AthenaHTA2\"}}) {\n      ...HelenaId\n    }\n    progress(\n      where: {_and: [{user: {login: {_eq: \"AthenaHTA2\"}}}, {object: {type: {_eq: \"project\"}}}, {isDone: {_eq: true}}, {grade: {_neq: 0}}]}\n      order_by: {updatedAt: desc}\n      \n    ) {\n      ...HelenaProgress\n    }\n    transaction(\n      where: {_and: [{user: {login: {_eq: \"AthenaHTA2\"}}}, {object: {type: {_eq: \"project\"}}}, {type: {_eq: \"xp\"}}]}\n      order_by: {amount:desc}\n    ) {\n      ...HelenaXP\n    }\n\n    tasksTypes:   transaction(where: { userId: { _eq: 715 }, type: {_like: \"%skill%\"}}){\n        type\n        amount\n      }\n      \n  }\n  \n    fragment HelenaId on user{\n   login\n    id\n    }\n    \n    fragment HelenaProgress on progress{\n        id\n      grade\n      createdAt\n      updatedAt\n      object {\n        id\n        name\n      campus\n}\n    }\n    \n    fragment HelenaXP on transaction{\n      amount\n      createdAt\n      object {\n        id\n        name\n      }\n    }",
  variables: {}
})
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: graphql,
  redirect: 'follow'
};
  fetch(
    'https://learn.01founders.co/api/graphql-engine/v1/graphql',
    requestOptions
  )
      .then(response =>{
        return response.json();//'then' turns the api reponse promise into a json first, next 'then' turns json 'data' into a native JS object
      }).then(data => {
          let typesOfTasks = data.data.tasksTypes;
          let projectsCount = data.data.progress.length;
          let xpCount = data.data.transaction.length;
          console.log("projectsCount>>>>>",projectsCount)
          console.log("typesOfTasks ----->:", typesOfTasks)

          var i, xpTotal = 0;
          //sum XP for all projects
          for(i = 0; i<xpCount; i++){
            for (let j = 0; j< projectsCount; j++){
              let progressDate = data.data.progress[j].updatedAt;
  
              let transactionsDate = data.data.transaction[i].createdAt;

              let date1 = progressDate.split(".")
              let date2 = transactionsDate.split(".")

              //hard-coded for 'math-skills' project as the two dates differ by a fraction of a second
              if(date1[0] == date2[0] || date1[0]== "2022-05-25T17:18:24" && date2[0]== "2022-05-25T17:18:25"){
                xpTotal = xpTotal + data.data.transaction[i].amount;

              }
             
            }

          }
          let hlogin = data.data.user[0].login;
          let hId = data.data.user[0].id;
          let hCampus = data.data.progress[0].object.campus;
          let totalXP = xpTotal
          let progName = data.data.progress[0].object.name;
          let progUpdatedAt = data.data.progress[0].updatedAt;
          let xpAmount = data.data.transaction[0].amount;
          let hGrade = data.data.progress[0].grade;
          //populate an array with profile data
          const profileHelena = [hlogin,hId,hCampus,totalXP,progName,progUpdatedAt,xpAmount, hGrade];
          console.log(profileHelena);
          //populate the 'Profile' section on 'At-a-glance' tab
          showProfile(profileHelena);
          //==============Projects' details=========================
          //get projects details
          let oneProject, helenaProjects 
          console.log("how many projects? ",projectsCount)
          for(let j=0; j<projectsCount; j++){
          let projectName = data.data.progress[j].object.name;
          let projectCompleted = data.data.progress[j].updatedAt;
          let ProjectAmount //xp amount is accessed from the 'transactions' table
          let ProjectGrade = data.data.progress[j].grade.toFixed(2);
          for(let x = 0; x<xpCount; x++){
              let progressDate = data.data.progress[j].updatedAt;
              let transactionsDate = data.data.transaction[x].createdAt;
              let date1 = progressDate.split(".");
              let date2 = transactionsDate.split(".");
              //hard-coded for 'math-skills' project as the two dates differ by a fraction of a second
              if(date1[0] == date2[0] || date1[0]== "2022-05-25T17:18:24" && date2[0]== "2022-05-25T17:18:25"){               
                ProjectAmount = data.data.transaction[x].amount;
              }
             
          }
          let projectID = data.data.progress[j].object.id;
          //make an array from each project's data
          oneProject = [projectName,projectCompleted,ProjectAmount,ProjectGrade,projectID];
          if(j==0){
            helenaProjects = new Array(oneProject);
          }else{
            helenaProjects.push(oneProject);
          }
          }
          //populate the 'Projects list' section of the 'At-a-glance'tab
            showProjects(helenaProjects)

          //populate the 'XP history' SVG line chart (inspiration: https://www.youtube.com/watch?v=RTUZ1VftA5o)
          XpByProjectLineGraph(helenaProjects,30, 4);

          //makes an array of skills objects e.g.:{name: 'Golang', skill_points: 310, projects_completed:10, color:'#16FF00'}
          SkillObjects = skillData(typesOfTasks);
          console.log("Aggregate points per skill: ====>", SkillObjects);
          allSkills = 0
          //sum of all skills' points
          for (let i=0; i<SkillObjects.length; i++){
              allSkills += SkillObjects[i].skill_points
          }
          console.log("Sum of all skills points:===>",allSkills)

          //add event listener to the pie-chart drop-down selection box
          //let SelectSkill = document.querySelector("#Skills");
          //SelectSkill.addEventListener("onchange", function(){
              //skill selected in drop-down box
              let theSkill = getSkill();
              console.log("New skill selected: ===",theSkill)
              //makes pie chart for each skill % of total skills 
              skillPercentage(theSkill, allSkills, SkillObjects);

          //make column chart showing my skills
          //the skills objects e.g.:{name: 'Golang', skill_points: 310, projects_completed:10, color:'#16FF00'}
          //SkillsBarChart(SkillObjects);
         // })


      })
      .catch(error => console.log('error', error));




      //populate the 'Profile' section on 'At-a-glance' tab
      function showProfile(data){
        var i, helenaProf;
        helenaProf = document.querySelector("#addData");
        console.log(helenaProf)
        for (i = 0; i< data.length; i++){
          helenaProf.innerHTML = `
          <div class="hProfile">
          <p >`+ "Login: " + data[0] + ",   ID: " + data[1] + `</p>
          <p >`+ "Campus: " + data[2] + `</p>
          <p >`+ "Sum of XP for all projects: " + numberWithCommas(data[3]) + `</p>
          <p >`+ "Latest project: " + data[4] + `</p>
          <p >`+ "Completed: " + ConvertDate(data[5]) + `</p>
          <p >`+ "XP amount: " + numberWithCommas(data[6]) + ",  Grade: " + data[7] + `</p>
          </div>
          `
        }
      }
      //populate the 'Projects list' section of the 'At-a-glance'tab
      function showProjects(projects){
        console.log("the projects array of data: ====>",projects)
        var check = []
        //remove duplicate projects
        let helenaProjects = document.querySelector("#projectsList");
        console.log(projects)
          for(let i = 0; i<projects.length; i++){
            if(check.includes(projects[i][0])){//skip duplicate project names
              continue
            }else{
              helenaProjects.innerHTML += `
              <div class="hProfile">
              <p >`+ "Name: " + projects[i][0] + `</p>
              <p >`+ "Completed: " + ConvertDate(projects[i][1]) + `</p>
              <p >`+ "XP: " + numberWithCommas(projects[i][2]) + ",   Grade: " + projects[i][3] + `</p>
              <p >`+ "ID: " + projects[i][4] + `</p>
              <p >` + " * * * * * * * " + `
              </div>`
            }
            check.push(projects[i][0])
          }
          console.log("the check list of projects: ------>",check)
      }

              
    //===========> Start of skills' points <=============
            // format skills and return cumulative skill points for each skill.
            function skillData(data) {
                data.forEach(skill => {
                  switch (skill.type) {
                    case "skill_algo":
                      skill.type = "Algorithms"
                      skill.color = "#FF0303"
                      break;
                    case "skill_prog":
                      skill.type = "Programming"
                      skill.color = "#2F58CD"
                      break;
                    case "skill_html":
                      skill.type = "HTML"
                      skill.color = "#30E3DF"
                      break;
                    case "skill_css":
                      skill.type = "CSS"
                      skill.color = "#F62924"
                      break;
                      case "skill_rust":
                        skill.type = "Rust"
                        skill.color = "#EEC373"
                        break;
                    case "skill_js":
                      skill.type = "JavaScript"
                      skill.color = "#FFED00"
                      break;
                    case "skill_go":
                      skill.type = "GO"
                      skill.color = "#16FF00"
                      break;
                    case "skill_front-end":
                      skill.type = "Frontend"
                      skill.color = "#C04A82"
                      break;
                    case "skill_back-end":
                      skill.type = "Backend"
                      skill.color = "#898121"
                      break;
                    case "skill_sql":
                      skill.type = "SQL"
                      skill.color = "#E7B10A"
                      break;
                      case "skill_graphql":
                        skill.type = "Graphql"
                        skill.color = "#FFC898"
                        break;
                      case "skill_svg":
                      skill.type = "SVG"
                      skill.color = "#FF87CA"
                      break;
                    case "skill_docker":
                      skill.type = "Docker"
                      skill.color = "#5D3891"
                      break;
                    case "skill_sys-admin":
                      skill.type = "Syst. Admin"
                      skill.color = "#000000"
                      break;
                    case "skill_game":
                      skill.type = "Games"
                      skill.color = "#3C84AB"
                      break;
                    case "skill_stats":
                      skill.type = "Statistics"
                      skill.color = "#FFE15D"
                      break;
                    default:
                      break;
                  }
                })

              let skills = {}

              data.forEach(skill => {

                // Cumulative points per skill
                if (!!skills[skill.type]) {
                  skills[skill.type] = {
                    name: skill.type,
                    skill_points: skill.amount + skills[skill.type].skill_points,
                    projects_completed: skills[skill.type].projects_completed + 1,
                    color: skill.color
                  }

                } else {
                  skills[skill.type] = {
                    name: skill.type,
                    skill_points: skill.amount,
                    projects_completed: 1,
                    color: skill.color
                  }
                }

              });

              return Object.values(skills);
            }

            //===========> End of skills' points <=============


            //the front-end, show page when clicking on page tab
                  function openPage(pageName,elmnt,color) {
                      var i, tabcontent, tablinks;
                      tabcontent = document.getElementsByClassName("tabcontent");
                      for (i = 0; i < tabcontent.length; i++) {
                        tabcontent[i].style.display = "none";
                      }
                      tablinks = document.getElementsByClassName("tablink");
                      for (i = 0; i < tablinks.length; i++) {
                        tablinks[i].style.backgroundColor = "";
                      }
                      document.getElementById(pageName).style.display = "block";
                      elmnt.style.backgroundColor = color;
                    }
                    //activates the 'At-a-glance' tab by default
                    document.getElementById("defaultOpen").click();
                    
                    //show the 'go-reloaded' Card by default
                    let allPoints = document.querySelectorAll(".point");
                    

                    //xp amount with commas
                    function numberWithCommas(x) {
                      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }

                  // Converts JS time stamp into a string
                    const ConvertDate = (date) => {
                      // Seperate year, day, hour and minutes into vars
                      let yyyy = date.slice(0, 4);
                      let dd = date.slice(8, 10);

                    // Get int for day of the week (0-6, Sunday-Saturday)
                    const d = new Date(date);
                    let dayInt = d.getDay();
                    let day = "";
                    switch (dayInt) {
                      case 0:
                        day = "Sunday";
                        break;
                      case 1:
                        day = "Monday";
                        break;
                      case 2:
                        day = "Tuesday";
                        break;
                      case 3:
                        day = "Wednesday";
                        break;
                      case 4:
                        day = "Thursday";
                        break;
                      case 5:
                        day = "Friday";
                        break;
                      case 6:
                        day = "Saturday";
                        break;
                    }

                    // Get int for month (0-11, January-December)
                    let monthInt = d.getMonth();
                    let month = "";
                    switch (monthInt) {
                      case 0:
                        month = "January";
                        break;
                      case 1:
                        month = "February";
                        break;
                      case 2:
                        month = "March";
                        break;
                      case 3:
                        month = "April";
                        break;
                      case 4:
                        month = "May";
                        break;
                      case 5:
                        month = "June";
                        break;
                      case 6:
                        month = "July";
                        break;
                      case 7:
                        month = "August";
                        break;
                      case 8:
                        month = "September";
                        break;
                      case 9:
                        month = "October";
                        break;
                      case 10:
                        month = "November";
                        break;
                      case 11:
                        month = "December";
                        break;
                    }
                    fullDate =
                      //day + ", " + dd + " " + month + ", " + yyyy + " @ " + hh + ":" + mm;
                      dd + " " + month + " " + yyyy;
                    return fullDate;
                  };



