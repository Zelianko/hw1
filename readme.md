Homework 1  Videos api  Body validation  POST -> "/videos": should return error if passed body is incorrect; status 400;



    Tested endpoint: videos

    Tested method: POST

    Expected status: 400

    Received status: 400

    Passed body: {"title":null,"author":"valid author","availableResolutions":["P144","P240","P720"]}

    Expected data: { errorsMessages: [{ message: Any<String>, field: "title" }] }

    Received data: {"errorMessages":[{"field":"title","message":"Invalid title"}]}

      40 |     }
      41 |
    > 42 |     expect(response).toBeError(400, incorrectFields, requestBody, {
         |                      ^
      43 |       endpoint: url,
      44 |       method,
      45 |     });

      at performTestsWithIncorrectBody (src/tests/jest/back/testHelpers/performTestsWithIncorrectBody.ts:42:22)
      at Object.<anonymous> (src/tests/jest/back/describes/videosApi/videos-body-validation-v2-describe.ts:102:9)

Отлично, теперь это уже не Vercel, а тесты задания. У тебя почти всё правильно: статус 400 проходит, проблема только в формате ответа.

Смотри внимательно:

Ожидается:

{
"errorsMessages": [
{
"message": "Any String",
"field": "title"
}
]
}

А у тебя приходит:

{
"errorMessages": [
{
"field": "title",
"message": "Invalid title"
}
]
}

Разница:

1. Название поля

У тебя:

"errorMessages"

Нужно:

"errorsMessages"

Там есть лишняя буква s после error:

❌

errorMessages

✅

errorsMessages
2. Порядок полей не важен

Вот это:

{
"field": "title",
"message": "Invalid title"
}

и:

{
"message": "Invalid title",
"field": "title"
}

для Jest обычно одинаково.

Где исправить

Скорее всего у тебя где-то в validation:

return res.status(400).send({
errorMessages: errors
});

Поменяй на:

return res.status(400).send({
errorsMessages: errors
});

Например:

if (!body.title || typeof body.title !== 'string') {
errors.push({
message: 'Invalid title',
field: 'title'
});
}

if (errors.length > 0) {
res.status(HttpStatus.BadRequest).send({
errorsMessages: errors
});
return;
}

После этого тест:

POST "/videos": should return error if passed body is incorrect

должен пройти.

У тебя уже:

endpoint работает ✅
статус правильный ✅
валидация срабатывает ✅

Осталось только привести контракт API к Swagger-требованию.