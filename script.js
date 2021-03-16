// Form components
const subjectForm = document.querySelector ("#subjectForm"); 
const queryText = document.querySelector ("#queryText"); 
const subjectDropdown = document.querySelector ("#subjectDropdown"); 
const submitSubjectButton = document.querySelector("#submitSubject"); 

// Verification components
const verificationForm = document.querySelector ("#verificationForm"); 
let changeButtons = document.querySelectorAll (".changeButton"); 
let verifyButton = document.querySelector ("#verifyButton")

// Data components
const subjectsCard = document.querySelector ("#subjects") 
const similarStudentsCard = document.querySelector ("#similarStudents"); 
const subjectStatsCards = document.querySelectorAll (".subjectStats"); 

// Subject choices
const languages = ["French", "Chinese", "Spanish", "Home Language Program", "None"]; 
const humanities = ["Economics", "Enterprise", "History", "Geography"]; 
const arts = ["Fine Art", "Graphic Design", "Dance", "Drama", "Film", "Music", "DT: Systems and Control", "DT: Resistant Materials", "Food and Nutrition"]; 
const other = ["Economics", "Enterprise", "History", "Global Perspectives", "Geography", "Fine Art", "Graphic Design", "DT: Systems and Control", "DT: Resistant Materials", "Music", "Drama", "Dance", "Film", "Food and Nutrition"]; 

// Choosing subjects
let subjects = []; 
let inputStage = 0; 
let finishedInput = false; 
let changeSubjectIndex = 0; 

let studentData = [] // List of all student data from CSV

const inputFunctions = 
[
    () => { inputSubject ("language", languages) }, 
    () => { inputSubject ("humanity", humanities) }, 
    () => { inputSubject ("art", arts) }, 
    () => { inputSubject ("other subject", other) }
]

const fadeIn = (element, blockFadedOut = false) =>
{
    element.classList.add ("fadeIn"); 
    element.classList.remove (!blockFadedOut ? "fadedOut" : "blockFadedOut"); 

    setTimeout(() => 
    {
        element.classList.add ("fadedIn"); 
        element.classList.remove ("fadeIn"); 
    }, 750);
}

const fadeOut = (element, blockFadedOut = false) =>
{
    element.classList.add ("fadeOut"); 
    element.classList.remove ("fadedIn"); 

    setTimeout(() => 
    {
        element.classList.add (!blockFadedOut ? "fadedOut" : "blockFadedOut"); 
        element.classList.remove ("fadeOut"); 
    }, 750);
}

const inputSubject = (subjectCatagory, subjectChoices) => 
{
    queryText.innerHTML = `What ${subjectCatagory} do you take?`; 

    subjectDropdown.innerHTML = '<option>Select</option>\n'; 
    subjectChoices.forEach(subject => 
    { 
        if (subject != subjects [0] && subject != subjects [1] && subject != subjects [2] && subject != subjects [3]) 
            subjectDropdown.innerHTML += `<option>${subject}</option>\n`; 
    }); 
}

const submitSubject = (subjectIndex) =>
{
    if (subjectDropdown.value == "Select")
    {
        alert ("Please select a subject"); 
        return; 
    }

    subjects [subjectIndex] = subjectDropdown.value; 

    if (inputStage < 3)
    {
        inputStage ++; 
        inputFunctions[inputStage](); 
    }
    else
    {
        fadeOut (subjectForm, true); 

        if (!verificationForm.classList.contains ("fadedIn"))
        {
            setTimeout(() => { fadeIn (verificationForm); }, 750);
            setTimeout(() => 
            {
                verifyInput(); 
                finishedInput = true; 
            }, 750);
        }
        else
            verifyInput (); 
    }
}

const verifyInput = () =>
{
    verificationForm.innerHTML = `<div class="verificationRow">
                                        <h3>${subjects[0]}</h3>
                                        <button class="changeButton">Change</button>
                                    </div>
                                    <div class="verificationRow">
                                        <h3>${subjects [1]}</h3>
                                        <button class="changeButton">Change</button>
                                    </div>
                                    <div class="verificationRow">
                                        <h3>${subjects [2]}</h3>
                                        <button class="changeButton">Change</button>
                                    </div>
                                    <div class="verificationRow">
                                        <h3>${subjects [3]}</h3>
                                        <button class="changeButton">Change</button>
                                    </div>
                                    <button id="verifyButton">Verify</button>`; 

    changeButtons = document.querySelectorAll (".changeButton"); 
    verifyButton = document.querySelector ("#verifyButton")

    changeButtons [0].addEventListener ("click", () => { changeSubject (0); })
    changeButtons [1].addEventListener ("click", () => { changeSubject (1); })
    changeButtons [2].addEventListener ("click", () => { changeSubject (2); })
    changeButtons [3].addEventListener ("click", () => { changeSubject (3); })
    verifyButton.addEventListener("click", verifySubjects);
}

const changeSubject = (subjectIndex) =>
{
    fadeIn (subjectForm, true); 

    changeSubjectIndex = subjectIndex; 
    inputFunctions [subjectIndex] (); 
}

const verifySubjects = () =>
{
    if (!subjectForm.classList.contains ("fadedOut") && !subjectForm.classList.contains ("blockFadedOut"))
        fadeOut (subjectForm); 

    fadeOut (verificationForm); 

    setTimeout(() => 
    { 
        subjectForm.classList.add ("fadedOut"); 
        subjectForm.classList.remove ("blockFadedOut"); 

        getAllData (); 
    }, 750);
}

// Async-await function to fetch data from csv
const getAllData = async () =>
{
    let response = ""; 
    
    try 
    { 
        response = await fetch ("subjects.csv"); 
    }
    catch (error)
    {
        console.error (error); 
        return; 
    }
    
    let text = await response.text(); 
    let lines = text.split ("\n"); 

    for (let i = 1; i < lines.length; i++) 
        studentData.push (lines [i].split (",")); 
    
    displaySubjects (); 
    fadeIn (subjectsCard); 

    getSimilarStudents (); 
    fadeIn (similarStudentsCard); 

    getSubjectInfo ("Language", languages, 0, 2); 
    getSubjectInfo ("Humanity", humanities, 1, 3); 
    getSubjectInfo ("Art", arts, 2, 4); 
    getSubjectInfo ("Other", other, 3, 5);  

    subjectStatsCards.forEach(card => { fadeIn (card); });
}

const displaySubjects = () =>
{
    subjectsCard.innerHTML += `<h3>Your Subjects</h3>
                                <h4>Language: ${subjects[0]}</h4>
                                <h4>Humanity: ${subjects [1]}</h4>
                                <h4>Art: ${subjects [2]}</h4>
                                <h4>Other: ${subjects [3]}</h4>`; 
}

const RemoveEmailDomain = (email) =>
{
    halves = email.split ("@"); 
    return halves [0]; 
}

const getArraysIntersection = (arrayOne, arrayTwo) =>
{ 
    return arrayOne.filter((n) => 
    { 
        return arrayTwo.indexOf(n) != -1;
    }); 
}

const getSimilarStudents = () => 
{
    let sameStudents = []; // Exact same subjects
    let similarStudents = []; // Three subjects in common
    
    studentData.forEach(data => 
    {
        intersectingSubjects = getArraysIntersection (subjects, data); 
        
        if (intersectingSubjects.length == 4) // 4 subjects in common
            sameStudents.push (`<h4>${RemoveEmailDomain(data [1])} from ${data [6]}</h4>`); 
        else if (intersectingSubjects.length == 3) // 3 subjects in common
            similarStudents.push (`<h4>${RemoveEmailDomain(data [1])} from ${data [6]} also takes ${intersectingSubjects [0]}, ${intersectingSubjects [1]}, and ${intersectingSubjects [2]}</h4>`); 
    });

    if (sameStudents.length == 0)
        similarStudentsCard.innerHTML = "<h3>No other students take the exact same subjects</h4>"; 
    else
    {
        similarStudentsCard.innerHTML = '<h3 class="subtitle">Other students who the same subjects</h3>'; 
        sameStudents.forEach(studentInfo => { similarStudentsCard.innerHTML += studentInfo; });
        similarStudentsCard.innerHTML += `<h3>${(Math.round((sameStudents.length / studentData.length) * 100) * 10) / 10}% of people chose the exact same subjects</h3>`
    }

    
    if (similarStudents.length >= 1)
    {
        similarStudentsCard.innerHTML += '<h3 class="subtitle">Other students who take similar subjects</h3>'; 
        similarStudents.forEach(studentInfo => { similarStudentsCard.innerHTML += studentInfo; });
    }
    
    similarStudentsCard.innerHTML += `<h3>${(Math.round((similarStudents.length / studentData.length) * 100) * 10) / 10}% of people have three subjects in common with you</h3>`
}

// Gets ranking of a particular subject
// subjectCatagory is the name of the catagory used for displaying data
// subjectChoices is the list of all possible choices for a subject
// subjectIndex is the index of subject's data subjects
// csvSubjectIndex is the index of subject's data inside CSV
const getSubjectInfo = (subjectCatagory, subjectChoices, subjectIndex, csvSubjectIndex) =>
{
    let popularity = []; 

    subjectChoices.forEach((subject) => 
    {
        let subjectPopularity = [0, 0]; 
        subjectPopularity [0] = subject; 
        subjectPopularity[1] = studentData.filter((x) => { return x [csvSubjectIndex] == subject }).length; 
        popularity.push (subjectPopularity); 
    });

    if (subjectChoices != other)
    {
        other.forEach ((subject) =>
        {
            if (subjectChoices.indexOf (subject) >= 0) // If other subject in current catagory
            {
                popularity.forEach ((element) =>
                {
                    if (element [0] == subject)
                        element [1] += studentData.filter((x) => { return x [5] == subject }).length; 
                })
            }
        })
    }
    else
    {
        humanities.forEach ((subject) =>
        {
            popularity.forEach ((element) =>
            {
                if (element [0] == subject)
                    element [1] += studentData.filter((x) => { return x [3] == subject }).length; 
            })
        })

        arts.forEach ((subject) =>
        {
            popularity.forEach ((element) =>
            {
                if (element [0] == subject)
                    element [1] += studentData.filter((x) => { return x [4] == subject }).length; 
            })
        })
    }

    popularity = popularity.sort((a, b) => { return a [1] == b [1] ? 0 : a[1] < b[1] ? -1 : 1; }).reverse ();

    let chosenSubjectIndex = 0; 

    subjectStatsCards [subjectIndex].innerHTML = `<h3 class="subtitle">${subjectCatagory}</h3>`; 

    popularity.forEach((subject, index) => 
    { 
        if (subjects [subjectIndex] == subject [0])
        {
            subjectStatsCards [subjectIndex].innerHTML += `<h4 class="boldH4">${index + 1}. ${subject [1]} people take ${subject [0]}</h4>`; 
            chosenSubjectIndex = index; 
        }
        else
            subjectStatsCards [subjectIndex].innerHTML += `<h4>${index + 1}. ${subject [1]} people take ${subject [0]}</h4>`; 
    });

    subjectStatsCards [subjectIndex].innerHTML += `<h3>${(Math.round((popularity[chosenSubjectIndex][1] / studentData.length) * 100) * 10) / 10}% of people take ${popularity[chosenSubjectIndex][0]}</h3>`; 
}

submitSubjectButton.addEventListener("click", () => { submitSubject (inputStage <= 3 && !finishedInput ? inputStage : changeSubjectIndex) });

inputFunctions[inputStage]()
