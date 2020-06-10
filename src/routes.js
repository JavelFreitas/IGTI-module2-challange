var express = require('express');
var router = express.Router();
var fs = require('fs');

router.use(express.json());

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

    grade = {id: grade.id, ...grade};

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
            return filteredGrade;
        }

        throw 'Could not find this grade';
        
    } catch (err) {
        throw err;
    }

}

function deleteGrade(id){
    try{
        const allGrades = getGrades();
        const index = parseInt(id);
        let message = '';
        const deletedGrade = allGrades.grades.find(grade => grade.id === index);
        if(typeof deletedGrade === 'undefined'){
            message = { error: 'Grade not found' }
            throw message;
        }

        const filteredGrades = allGrades.grades.filter(grade => grade.id !== index);

        const remainingGrades = {nextId: (allGrades.nextId), grades: filteredGrades}
        
        writeFile(remainingGrades);
        message = { status: 'Deleted with success', deletedGrade}
        return message;

    }catch(err){
        throw err;
    }
}

router.post('/newGrade', (request, response) => {
    const { student, subject, type, value } = request.body;

    const newGrade = {
        student, subject, type, value: parseFloat(value), timestamp: new Date()
    }

    const savedGrade = saveGrade(newGrade);

    response.send(savedGrade);
});

router.get('/getGrade/:id', (request, response) => {
    try {
        const gradeRequested = getGradeById(request.params.id);

        response.json(gradeRequested);
    } catch (err) {
        response.status(404).send(err)
    }
});

router.delete('/deleteGrade/:id', (request, response) => {
    try{
        const deleteMessage = deleteGrade(request.params.id)
        response.json(deleteMessage);
    }catch(err){
        response.status(404).send(err);
    }
});

module.exports = router;