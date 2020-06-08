var express = require('express');
var fs = require('fs');

const api = express();
api.use(express.json());
const data = Date.now();

function getGrades() {
    const grades = fs.readFileSync('./files/grades.json', 'UTF-8');
    const gradesJSON = JSON.parse(grades.toString());
    return gradesJSON;
}

function writeFile(grades) {
    fs.writeFileSync('./files/grades.json', JSON.stringify(grades, null, 2));
}

function saveGrade(grade) {
    const allGrades = getGrades();

    grade.id = allGrades.nextId;

    allGrades.grades.push(grade);
    allGrades.nextId += 1;

    writeFile(allGrades);

    return grade;
}




api.post('/newGrade', (request, response) => {
    const { student, subject, type, value } = request.body;

    const newGrade = {
        student, subject, type, value: parseFloat(value), date: new Date()
    }

    const savedGrade = saveGrade(newGrade);

    response.send(savedGrade);
})



api.listen(3000, () => {
    console.log("Hello");

});
