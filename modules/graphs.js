    //draws the line graph showing XPs by project
    //My skills pie chart was inspired by: https://www.youtube.com/watch?v=XEUCs7Sh8FI

      function XpByProjectLineGraph(array, frequency, linecount) {
        array = array.reverse();
        const svgPathParent = document.getElementById("svg-path");
        const Card = document.getElementById("card");
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
            //   
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
              circleEl.addEventListener("mouseover", (e) => {/*Card.style = `top:-4px; left:0px; display: block;`;*/
              // removed the moving Card:`top:${yValue - 20}px; left:${xValue - 80}px; display: block;`
              //Card.innerHTML = `XP: ${numberWithCommas(array[d][2])} <br>project: ${array[d][0]} <br>date: ${ConvertDate(array[d][1])}`;});
              Card.innerHTML = `${array[d][0]}` +":  "+ `${(array[d][2]/1000).toFixed(1)}` +"k xp, "+ `${ConvertDate(array[d][1])}`;
         
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
    SelectSkill.onchange = ()=>{
        //skill selected in drop-down box
        let theSkill = getSkill();
        //makes pie chart for each skill % of total skills 
        skillPercentage(theSkill, allSkills, SkillObjects);
        // console.log("All skills point accessible in event listener? ===",allSkills);
        // console.log("All skills array accessible in event listener? ===",SkillObjects);
        }


    // get skill from drop-down selection box
    const getSkill = () => {
        var chosenSkill = SelectSkill.options[SelectSkill.selectedIndex].text;
        
        return chosenSkill
    }
    // console.log("drop-down selection is: --->",getSkill())


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
            // console.log("new skill & ===>",skillPerc)
            //percentage of the pie circumference, remember r1 = 100px
            let piePerc = `calc(${skillPerc} * 314.2/100)`
            //set second parameter to the circonference of the circle
            //so that we are left with a single wedge
            let strDasharray = piePerc  + " 314.2"
            // console.log("the piePerc value is:===>",piePerc)
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
