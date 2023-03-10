import React, { useState } from "react";
import "./RecipeForm.css";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  content: {
    padding: "20px",
    marginBottom: "20px",
    border: "2px solid black",
    borderRadius: "10px",
  },
  formContainer: {
    marginTop: "20px",
    padding: "20px",
    border: "2px solid black",
    borderRadius: "10px",
  },
});
const { Configuration, OpenAIApi } = require("openai");

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

function RecipeForm() {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    ingredients: "",
  });
  const [submittedData, setSubmittedData] = useState([]);
  const [generatedText, setGeneratedText] = useState("");
  const [enteredIngredients, setEnteredIngredients] = useState("");

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const prompt = `Write a recipe based on these ingredients and instructions:\n\n${formData.ingredients}\n\nIngredients:\n\nInstructions:`;
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.3,
        max_tokens: 240,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      console.log(response);

      if (
        response.status === 200 &&
        response.data.choices &&
        response.data.choices.length > 0
      ) {
        const generatedRecipe = response.data.choices[0].text;
        setGeneratedText(generatedRecipe);
        setEnteredIngredients(formData.ingredients);
        setSubmittedData([...submittedData, formData]);
        setFormData({ ingredients: "" });
      } else {
        console.error("Failed to generate recipe.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="RecipeForm">
      <h1 className="RecipeForm__heading">Recipe Builder</h1>
      <h2 style={{ display: "flex", justifyContent: "center" }}>
        Please enter your list of ingredients:
      </h2>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            id="ingredients"
            name="ingredients"
            label="Ingredients"
            variant="outlined"
            value={formData.ingredients}
            onChange={handleInputChange}
            placeholder="Enter a list of ingredients"
            fullWidth
            multiline
            rows={4}
            style={{
              border: "2px solid black",
              borderRadius: "10px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 20px",
          }}
        >
          <Button type="submit" variant="contained" color="secondary">
            Submit
          </Button>
        </div>
      </form>

      {enteredIngredients && (
        <Paper className={classes.content}>
          <Typography variant="h5" gutterBottom>
            Entered Ingredients:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {enteredIngredients}
          </Typography>
        </Paper>
      )}

      {generatedText && (
        <div>
          <Paper className={classes.content}>
            <Typography variant="h5" gutterBottom>
              Generated Recipe:
            </Typography>

            {generatedText.split("\n").map((line, index) => (
              <Typography key={index} variant="body1" gutterBottom>
                {line}
              </Typography>
            ))}
          </Paper>
        </div>
      )}
    </div>
  );
}

export default RecipeForm;
