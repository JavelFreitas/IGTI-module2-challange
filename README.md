# Challange 2 module 2

Practical challenge from IGTI's 2020 Fullstack Bootcamp.

## Objective

To practice NodeJS knowledge gathered during Module 2 classes.

## About the project

```
The api administer a file of students grades. 
```

The main purpose is to create, update, read and delete grades from the file.

It also calculates the average, the medium and the sum of grades based of a filter.


## Aplication endpoints

1. **grades/newGrade**

    Body params: student ,subject, type, value(Number).
    
    Return: An object with the params information and with timestamp of the moment of creation and an id.

2. **grades/updateGrade**

    Body params: id, student, subject, type, value.

    Return: An object with a message and an object inside named newGrade with the updated grade.

3. **grades/deleteGrade/:id**

    Params: id of grade to be deleted.

    Return: An object with a message and the grade deleted.

4. **grades/getGrade/:id**

    Params: id of grade to be requested.

    Return: The grade requested.

5. **grades/valueSum**

    Body params: student and subject.

    Return: The sum of all the grades of that student in that subject.

6. **grades/typeAverage**

    Body params: type and subject.

    Return: The medium of all the grades of that subject in that type.

7. **grades/threeBest**

    Body params: type and subject.

    Return: The three best grades of that subject in that type.