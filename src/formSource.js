
export const userInputs = [
  {
    fieldName: "name",
    id: 1,
    label: "User Name",
    type: "text",
    placeholder: "E.g: Jawwad",
  },
  {
    fieldName: "email_id",
    id: 2,
    label: "Email",
    type: "text",
    placeholder: "E.g: muhammadjawwad417@gmail.com",
  },
  {
    fieldName: "status",
    id: 3,
    label: "Status",
    type: "dropdown",
    options: [1, 0],
    placeholder: "E.g: 1 or 0",
  },
  {
    fieldName: "type",
    id: 4,
    label: "Type",
    type: "dropdown",
    options: [
      {
        key: "ECAT",
        value: "ECAT"
      },
      {
        key: "MCAT",
        value: "MCAT"
      },
      {
        key: "Entry Test",
        value: "ET"
      }
    ],
    placeholder: "Select",
  },
  {
    fieldName: "password",
    id: 5,
    label: "Password",
    type: "text",
    placeholder: "E.g: min: 6 characters",
  },
  {
    fieldName: "gender",
    id: 6,
    label: "Gender",
    type: "dropdown",
    options: ["", "Male", "Female"],
    placeholder: "Select",
  },
  {
    fieldName: "mobile_number",
    id: 7,
    label: "Contact",
    type: "number",
    placeholder: "E.g: 923.........",
  },
];

export const categoryInputs = [
  {
    fieldName: "category_name",
    id: 1,
    label: "Category Name",
    type: "text",
    placeholder: "E.g: Applied Mathematics",
  },
  {
    fieldName: "no_of_quiz",
    id: 2,
    label: "Number of Quiz",
    type: "number",
    placeholder: "E.g: 10",
  },
  {
    fieldName: "status",
    id: 3,
    label: "Status",
    type: "dropdown",
    options: [1, 0],
    placeholder: "E.g: 1 or 0",
  },
  {
    fieldName: "type",
    id: 4,
    label: "Type",
    type: "dropdown",
    options: [
      {
        key: "ECAT",
        value: "ECAT"
      },
      {
        key: "MCAT",
        value: "MCAT"
      },
      {
        key: "Entry Test",
        value: "ET"
      }
    ],
    placeholder: "Select",
  },
];

export const quizInputs = [
  {
    fieldName: "category_id",
    id: 1,
    label: "Category",
    type: "number",
    placeholder: "E.g: 2",
  },
  {
    fieldName: "quiz_no",
    id: 2,
    label: "Quiz Number",
    type: "text",
    placeholder: "E.g: Quiz 3",
  },
  {
    fieldName: "quiz_name",
    id: 3,
    label: "Quiz Name",
    type: "text",
    placeholder: "E.g: The Scientific Method",
  },
  {
    fieldName: "no_of_questions",
    id: 4,
    label: "Number of Questions",
    type: "number",
    placeholder: "E.g: 20",
  },
  {
    fieldName: "duration",
    id: 5,
    label: "Duration (Minutes)",
    type: "number",
    placeholder: "E.g: 5 (In Minutes)",
  },
  {
    fieldName: "description",
    id: 6,
    label: "Description",
    type: "text",
    placeholder: "E.g: Let's put your memory on our first topic to test.",
  },
  {
    fieldName: "no_of_attempts",
    id: 7,
    label: "No of Attempts",
    type: "dropdown",
    options: ["", "one", "infinite"],
    placeholder: "Select",
  },
  {
    fieldName: "status",
    id: 8,
    label: "Status",
    type: "dropdown",
    options: [1, 0],
    placeholder: "E.g: 1 or 0",
  },
];

export const questionInputs = [
  {
    fieldName: "quiz_id",
    id: 1,
    label: "Quiz",
    type: "number",
    placeholder: "E.g: 2",
  },
  {
    fieldName: "question",
    id: 2,
    label: "Question",
    type: "text",
    placeholder: "E.g: What is the smallest unit of life?",
  },
  {
    fieldName: "option_1",
    id: 3,
    label: "Option 1",
    type: "text",
    placeholder: "E.g: Cell",
  },
  {
    fieldName: "option_2",
    id: 4,
    label: "Option 2",
    type: "text",
    placeholder: "E.g: Atom",
  },
  {
    fieldName: "option_3",
    id: 5,
    label: "Option 3",
    type: "text",
    placeholder: "E.g: Molecule",
  },
  {
    fieldName: "option_4",
    id: 6,
    label: "Option 4",
    type: "text",
    placeholder: "E.g: Tissue",
  },
  {
    fieldName: "correct_option",
    id: 7,
    label: "Correct Option",
    type: "text",
    placeholder: "E.g: Cell",
  },
  {
    fieldName: "status",
    id: 8,
    label: "Status",
    type: "dropdown",
    options: [1, 0],
    placeholder: "E.g: 1 or 0",
  },
];
