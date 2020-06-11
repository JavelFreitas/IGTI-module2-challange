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

    grade = { id: grade.id, ...grade };

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

function deleteGrade(id) {
    try {
        const allGrades = getGrades();
        const index = parseInt(id);
        let message = '';
        const deletedGrade = allGrades.grades.find(grade => grade.id === index);
        if (typeof deletedGrade === 'undefined') {
            message = { error: 'Grade not found' }
            throw message;
        }

        const filteredGrades = allGrades.grades.filter(grade => grade.id !== index);

        const remainingGrades = { nextId: (allGrades.nextId), grades: filteredGrades }

        writeFile(remainingGrades);
        message = { status: 'Deleted with success', deletedGrade }
        return message;

    } catch (err) {
        throw err;
    }
}

function sumGrades(student, subject) {
    try {
        const allGrades = getGrades();

        const filteredGrades = allGrades.grades.filter(grade => grade.student === student && grade.subject === subject);
        if (filteredGrades.length === 0) {
            throw 'Student or subject not found';
        }
        const sumValues = filteredGrades.reduce((acc = 0, cur) => acc + parseInt(cur.value), 0);
        return sumValues;

    } catch (error) {
        throw error;
    }
}

function typeAverage(subject, type) {
    try {
        const allGrades = getGrades();

        const filteredGrades = allGrades.grades.filter(grade => grade.type === type && grade.subject === subject);

        if (filteredGrades.length === 0) {
            throw 'Type or subject not found';
        }

        const sumValues = filteredGrades.reduce((acc = 0, cur) => acc + parseInt(cur.value), 0);
        
        console.log(sumValues);
        console.log(filteredGrades.length);
        
        const average = sumValues / filteredGrades.length;

        return average;

    } catch (error) {
        throw error;
    }
}

function getThreeBestGrades(subject, type) {
    try {
        const allGrades = getGrades();

        const filteredGrades = allGrades.grades.filter(grade => grade.type === type && grade.subject === subject);

        if (filteredGrades.length === 0) {
            throw 'Type or subject not found';
        }

        const sortedGrades = filteredGrades.sort((a, b) => {
            if(a.value > b.value) return -1
            else if(a.value < b.value) return 1;
            else return 0;
        });

        return sortedGrades.slice(0,3);


    } catch (error) {
        throw error;
    }
}

function updateGrade(newGrade) {
    try {
        const allGrades = getGrades();
        const gradeIndex = allGrades.grades.findIndex(grade => grade.id === newGrade.id);

        if (gradeIndex === -1) {
            throw `Id ${newGrade.id} does not exist`;
        }

        newGrade.timestamp = allGrades.grades[gradeIndex].timestamp;
        allGrades.grades[gradeIndex] = newGrade;

        writeFile(allGrades);
    } catch (error) {
        throw error;
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

router.get('/valueSum', (request, response) => {
    try {
        const { student, subject } = request.body;
        const totalValue = sumGrades(student, subject);
        response.json({ value: totalValue });
    } catch (error) {
        response.status(404).send(error);
    }
});

router.get('/typeAverage', (request, response) => {
    try {
        const { subject, type } = request.body;
        const average = typeAverage(subject, type);
        response.json({ average });
    } catch (error) {
        response.json({ error });
    }
});

router.get('/threeBest', (request, response) => {
    try {
        const { subject, type } = request.body;
        const topThree = getThreeBestGrades(subject, type);
        response.json({ topThree });
    } catch (error) {
        response.json({ error });
    }
});

router.put('/updateGrade', (request, response) => {
    try {
        const { id, student, subject, type, value } = request.body;
        const newGrade = { id: parseInt(id), student, subject, type, value: parseInt(value) };
        updateGrade(newGrade);
        response.json({ message: "Grade updated", newGrade });
    } catch (error) {
        response.status(404).json({ error });
    }
})

router.delete('/deleteGrade/:id', (request, response) => {
    try {
        const deleteMessage = deleteGrade(request.params.id)
        response.json(deleteMessage);
    } catch (err) {
        response.status(404).send(err);
    }
});

module.exports = router;