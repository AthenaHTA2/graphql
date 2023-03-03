/*to run in node
import { JSDOM as _JSDOM } from "jsdom";
var JSDOM = _JSDOM;
global.document = new JSDOM("html://localhost:5500").window.document;*/


//===============> Start of my original graphql query <====================
//the API: https://learn.01founders.co/api/graphql-engine/v1/graphql
/*my graphql query, used for profile data, projects' details,  
//XP by project line graph, XP by task pie chart.

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

  


//===============> End of my original graphql query <====================
*/

//===========> I partly used the 'Postman' appication to build the below 'Javascript Fetch: <=======
// the array of IT skills objects
var SkillObjects = []
var allSkills = 0
// the IT skills drop-down selection box
let selectSkill = document.getElementById("Skills")

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
          xpByProjectLineGraph(helenaProjects,30, 4);

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
          //let selectSkill = document.querySelector("#Skills");
          //selectSkill.addEventListener("onchange", function(){
              //skill selected in drop-down box
              let theSkill = getSkill();
              console.log("New skill selected: ===",theSkill)
              //makes pie chart for each skill % of total skills 
              skillPercentage(theSkill, allSkills, SkillObjects);

          //make column chart showing my skills
          SkillsBarChart(SkillObjects);
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

      //draws the line graph showing XPs by project
      function xpByProjectLineGraph(array, frequency, linecount) {
        array = array.reverse();
        const svgPathParent = document.getElementById("svg-path");
        const card = document.getElementById("card");
        const svgElment = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        // svgPath.style.height = "180px";
        const numProjects = array.length;

        const maxVal = array[numProjects-1][2]/1000;
        console.log("the largest XP in line graph:--->",maxVal);
        console.log("the index of the largest XP --->",array.indexOf(147000));

        //the SVG container dimensions are: 370px * 165px; the container id: #lineGraph
        let widthSvg = Math.min(numProjects * frequency,370);
        frequency = widthSvg/numProjects;
        widthSvg = numProjects * frequency;
        console.log("graph frequency:--->",frequency)
        const heightSvg = maxVal + 15;
        const graphLine = maxVal / (linecount - 1);

          svgElment.setAttributeNS(null, "width", widthSvg);
          svgElment.setAttributeNS(null, "height", heightSvg);
          svgElment.id="lineGraph";

          // g tags for grouping other tags
          const gElCircle = document.createElementNS("http://www.w3.org/2000/svg", "g");
          gElCircle.id = "graph-points";
        
          const gElLine = document.createElementNS("http://www.w3.org/2000/svg", "g");
          gElLine.id = "graph-lines";
          gElLine.zIndex = 0;

          const gElText = document.createElementNS("http://www.w3.org/2000/svg", "g");
          gElText.id = "graph-texts";

          // base line
          let pathString = "M" + widthSvg + " " + heightSvg + " L" + 0 + " " + widthSvg;
              
          for (let d = 0; d <numProjects; d++) {
              const yValue = heightSvg - array[d][2]/1000, xValue = d * frequency+5;
              const newString = " L" + xValue + " " + yValue;
              pathString += newString;

              const circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              circleEl.setAttributeNS(null, "cx", xValue+1);
              circleEl.setAttributeNS(null, "cy", yValue);
              circleEl.setAttributeNS(null, "r", "6");
              circleEl.style.fill="#3C84AB"
              circleEl.classList.add="point"
              circleEl.style.zIndex=9;
              circleEl.addEventListener("mouseover", (e) => {/*card.style = `top:-4px; left:0px; display: block;`;*/
              // removed the moving card:`top:${yValue - 20}px; left:${xValue - 80}px; display: block;`
              //card.innerHTML = `XP: ${numberWithCommas(array[d][2])} <br>project: ${array[d][0]} <br>date: ${ConvertDate(array[d][1])}`;});
              card.innerHTML = `${array[d][0]}` +":  "+ `${(array[d][2]/1000).toFixed(1)}` +"k xp, "+ `${ConvertDate(array[d][1])}`;
            
            });
             
              gElCircle.appendChild(circleEl);
             
              
            }
              //heightSvg = maxValue + 15px
              const ends = heightSvg - array[numProjects-1][2]/1000;
              console.log("heightSvg of the graph:--->",heightSvg)
              console.log("value in 'array' of the graph:--->",array[numProjects-1][2])
              console.log("The end of the graph:--->",ends)
              // pathString += " L" + widthSvg + " " + ends;
              pathString += " L" + widthSvg + " " + ends;
              pathString += "Z";
              svgPath.setAttributeNS(null, "d", pathString);

              // lines and texts
              for (let l = 0; l < linecount; l++) {
                const lineEl = document.createElementNS("http://www.w3.org/2000/svg", "line");
                const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
                const yPosition = heightSvg - (l * graphLine);
                lineEl.setAttributeNS(null, "x1", "0");
                lineEl.setAttributeNS(null, "y1", yPosition);
                lineEl.setAttributeNS(null, "x2", widthSvg);
                lineEl.setAttributeNS(null, "y2", yPosition);
                gElLine.appendChild(lineEl);
                let yLables = widthSvg - 25;
                const txt = l * graphLine + "k";
                textEl.setAttributeNS(null, "dx", -yLables);
                textEl.setAttributeNS(null, "x", widthSvg);
                textEl.setAttributeNS(null, "y", yPosition);
                textEl.textContent = txt;

                gElText.appendChild(textEl);

              }

              svgElment.appendChild(gElCircle);
              svgElment.appendChild(gElLine);
              svgElment.appendChild(gElText);
              svgElment.appendChild(svgPath);

              // base parent or graph container
              svgPathParent.appendChild(svgElment);

          }

            //add event listener to the pie-chart drop-down selection box
            selectSkill.onchange = ()=>{
              //skill selected in drop-down box
              let theSkill = getSkill();
              
              //makes pie chart for each skill % of total skills 
              skillPercentage(theSkill, allSkills, SkillObjects);
              console.log("All skills point accessible in event listener? ===",allSkills);
              console.log("All skills array accessible in event listener? ===",SkillObjects);
            }


          // get skill from drop-down selection box
          const getSkill = () => {
            var chosenSkill = selectSkill.options[selectSkill.selectedIndex].text;
            
            return chosenSkill
          }
          console.log("drop-down selection is: --->",getSkill())

          
          //draws a pie chart wedge for the selected skill
          //pie chart inspired by: https://www.youtube.com/watch?v=XEUCs7Sh8FI
          function skillPercentage(chosenSkill, allSkillsPoints, SkillObjects){
            const svgPieChartParent = document.getElementById("pieChart");
            console.log("the skills array:===>",SkillObjects)
            //remove previous pie graph elements
            d3.select('#skillName').remove();
            d3.select('#circle2'). remove();
            d3.select('#circle1'). remove();
            d3.select('#cont').remove();
            svgPieChartParent
            for(let i=0; i<SkillObjects.length; i++){
              let oneObject = SkillObjects[i]
              if(oneObject.name == chosenSkill){
                let skillColour = oneObject.color;
                //% of total skills
                let skillPerc = (oneObject.skill_points / allSkillsPoints) * 100 ;
                skillPerc = skillPerc.toFixed(1);
                console.log("new skill & ===>",skillPerc)
                //percentage of the pie circumference, remember r1 = 100px
                let piePerc = `calc(${skillPerc} * 314.2/100)`
                //set second parameter to the circonference of the circle
                //so that we are left with a single wedge
                let strDasharray = piePerc  + " 314.2"
                console.log("the piePerc value is:===>",piePerc)
                let r= "50";
                let cx = "100";
                let cy = "100";
                //set strWidth same as radius of circle1
                let strWidth = "100";
                let txt = chosenSkill + " " + skillPerc + "%"
                //the div that contains the drop-down list and the pie chart
                //the svg element
                const svgElment = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                //the g tag for grouping circle2 elements; to be appended to 'svgElement'
                const gElCircle1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
                gElCircle1.id = "circle1";
                gElCircle1.classList.add("pieGraph")
                //the g tag for grouping circle2 elements; to be appended to 'svgElement'
                const gElCircle2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
                gElCircle2.id = "circle2";
                gElCircle2.classList.add("pieGraph")
                //pie chart text showing the % of total skills
                const gElText = document.createElementNS("http://www.w3.org/2000/svg", "g");
                gElText.id = "skillName";

                //set attributes for the 'svg' element
                svgElment.setAttributeNS(null, "width", '20');
                svgElment.setAttributeNS(null, "height", '20');
                svgElment.setAttributeNS(null, "viewbox", '0 0 20 20');
                svgElment.setAttributeNS(null, "style", 'margin-left: 40px');
                svgElment.id="cont"

                //set attributes for the circle1 element
                const circle1El = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle1El.id = "circle1";
                circle1El.setAttributeNS(null, 'r', '100');
                circle1El.setAttributeNS(null, 'cx', '100');
                circle1El.setAttributeNS(null, 'cy', '100');
                circle1El.setAttributeNS(null, 'fill', 'white');

                //group all circle1 attributes
                gElCircle1.appendChild(circle1El);

                //set attributes for the circle2 element
                const circle2El = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle2El.id = "circle2";
                circle2El.setAttributeNS(null, 'r', r);
                circle2El.setAttributeNS(null, 'cx', cx);
                circle2El.setAttributeNS(null, 'cy', cy);
                circle2El.setAttributeNS(null, 'fill', 'transparent');
                circle2El.setAttributeNS(null, 'stroke', skillColour);
                circle2El.setAttributeNS(null, 'stroke-width', strWidth);
                circle2El.setAttributeNS(null, 'stroke-dasharray', strDasharray);
                circle2El.setAttributeNS(null, 'transform', 'rotate(-90) translate(-200)');

                //group all circle2 attributes
                gElCircle2.appendChild(circle2El);

                //text showing skill %
                const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
                //let yLables = widthSvg - 25;
                textEl.setAttributeNS(null, "dx", cx);
                textEl.setAttributeNS(null, "x", '10');
                textEl.setAttributeNS(null, "y", '110');
                textEl.textContent = txt;

                gElText.appendChild(textEl);

                //append the two circles and the text to the svg element
                svgElment.appendChild(gElCircle1);
                svgElment.appendChild(gElCircle2);
                svgElment.appendChild(gElText);

                //append the svg element to its parent
                svgPieChartParent.appendChild(svgElment);
              }
              }
            }

//=============> Start of bar chart showing all my IT skills <=================
//bar chart inspiration: https://github.com/kriscfoster/d3-barchart/blob/master/index.js

// const data = [
//   { name: 'John', score: 80 },
//   { name: 'Simon', score: 76 },
//   { name: 'Samantha', score: 90 },
//   { name: 'Patrick', score: 82 },
//   { name: 'Mary', score: 90 },
//   { name: 'Christina', score: 75 },
//   { name: 'Michael', score: 86 },
// ];
function SkillsBarChart(data){
  const width = 900;
  const height = 450;
  const margin = { top: 50, bottom: 50, left: 50, right: 50 };
  
  const svg = d3.select('#d3-container')
    .append('svg')
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr("viewBox", [0, 0, width, height]);
  
  const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1)
  
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top])
  
  svg
    .append("g")
    .attr("fill", 'royalblue')
    .selectAll("rect")
    .data(data.sort((a, b) => d3.descending(a.skill_points, b.skill_points)))
    .join("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.skill_points))
      .attr('title', (d) => d.skill_points)
      .attr("class", "rect")
      .attr("height", d => y(0) - y(d.skill_points))
      .attr("width", x.bandwidth());
  
  function yAxis(g) {
    g.attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).ticks(null, data.format))
      .attr("font-size", '20px')
  }
  
  function xAxis(g) {
    g.attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => data[i].name))
      .attr("font-size", '20px')
  }
  
  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  svg.node();
  

}

//=============> End of bar chart showing all my IT skills <=================


          
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
                    
                    //show the 'go-reloaded' card by default
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

//=======> Project details tab graph & table <==============  

