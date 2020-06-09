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

function getGradeById(id) {
    try {
        const allGrades = getGrades();
        const filteredGrade = allGrades.grades.find(grade => grade.id == id);

        console.log(filteredGrade);

        
        if (typeof filteredGrade !== 'undefined') {
            console.log('inside filtered');
            
            return filteredGrade;
        }

        throw 'Could not find this grade';
        
    } catch (err) {
        throw err;
    }

}


api.post('/newGrade', (request, response) => {
    const { student, subject, type, value } = request.body;

    const newGrade = {
        student, subject, type, value: parseFloat(value), date: new Date()
    }

    const savedGrade = saveGrade(newGrade);

    response.send(savedGrade);
})

api.get('/getGrade/:id', (request, response) => {
    try {
        const gradeRequested = getGradeById(request.params.id);

        response.json(gradeRequested);
    } catch (err) {
        response.status(404).send(err)
    }
})


api.listen(3000, () => {
});
