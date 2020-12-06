import logo from './logo.svg';
import React from 'react';

function RecipeList(props) {
  const recipes = props.recipes;
  const timeFontSize = {
    fontSize: '89%'
  };
  const listRecipes = recipes.map((recipe) =>
    <tr key={recipe.uuid} onClick={() => props.onClick(recipe)} style={{ cursor: 'pointer' }}>
      <td><img src={'http://localhost:3001' + recipe.images.small} alt={recipe.title} /></td>
      <td>
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '130%' }}>{recipe.title}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{recipe.description}</td>
            </tr>
            <tr>
              <td style={timeFontSize}><i>Prep time: {recipe.prepTime} mins</i></td>
            </tr>
            <tr>
              <td style={timeFontSize}><i>Cook time: {recipe.cookTime} mins</i></td>
            </tr>
            <tr>
              <td style={timeFontSize}><i>Servings: {recipe.servings}</i></td>
            </tr>
            <tr>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );

  return (
    <table style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '3%' }}>
      <tbody>
        {listRecipes}
      </tbody>
    </table>
  );
}

function getSpecialIng(ingUuid, specialIngData) {
  let specialIng = specialIngData.filter(element => {
    return ingUuid == element.ingredientId;
  });
  console.log(specialIng);
  return specialIng.length > 0 ? specialIng : null;
}

function recipeIngredientsTable(ingredientData, specialIngData) {
  const ingredients = ingredientData.map((ingredient, i) => {
    let specIng = getSpecialIng(ingredient.uuid, specialIngData);
    return <tr key={i}>
      <td>
        {ingredient.name + ', ' + ingredient.amount + ' ' + ingredient.measurement}
        <br /><b><i style={{color: '#58ba20'}}>{specIng ? specIng[0].title + ' ' + specIng[0].type + ' - ' + specIng[0].text : ''}</i></b>
      </td>
    </tr>
  });

  return (
    <table style={{ textAlign: 'left' }} border="1" frame="hsides" rules="rows">
      <thead>
        <tr>
          <th>Ingredients</th>
        </tr>
      </thead>
      <tbody>
        {ingredients}
      </tbody>
    </table>
  );
}

function recipeInstructionTable(data) {
  const directions = data.map((direction, i) =>
    <tr key={i}>
      <td>{parseInt(i + 1) + '. '}{direction.optional ? <i>(Optional) </i> : ''}{direction.instructions}</td>
    </tr>
  );
  return (
    <table style={{ marginLeft: '7%', textAlign: 'left' }}>
      <thead>
        <tr>
          <th>Directions</th>
        </tr>
      </thead>
      <tbody>
        {directions}
      </tbody>
    </table>
  );
}

function Recipe(props) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>{props.recipe.title}</h1>
      <img src={'http://localhost:3001' + props.recipe.images.medium} alt={props.recipe.title} />
      <p style={{ fontSize: '89%' }}><i>{props.recipe.editDate ? 'Last Edited: ' + props.recipe.editDate : 'Posted ' + props.recipe.postDate}</i></p>
      <table style={{ marginLeft: 'auto', marginRight: 'auto', width: '25%'}} border="1" frame="void" rules="cols">
        <tbody>
          <tr style={{ fontSize: '90%' }}>
            <td>Prep time: {props.recipe.prepTime} mins</td>
            <td>Cook time: {props.recipe.cookTime} mins</td>
            <td>Servings: {props.recipe.servings}</td>
          </tr>
        </tbody>
      </table>
      <p><h3>{props.recipe.description}</h3></p>
      <table style={{ marginLeft: '25%', marginRight: 'auto' }}>
        <tbody>
          <tr valign="top">
            <td style={{width: '18%'}}>{recipeIngredientsTable(props.recipe.ingredients, props.specialIng)}</td>
            <td style={{width: '82%'}}>{recipeInstructionTable(props.recipe.directions)}</td>
          </tr>
        </tbody>
      </table>
      <br />
      <button style={{ border: 'none', backgroundColor: 'black', color: 'white', padding: '1em', cursor: 'pointer' }}
        onClick={() => props.onReload()}
      >Return to Main Menu</button>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      showRecipeList: true,
      showRecipe: false,
      currRecipe: null,
      specialIng: []
    }
  }


  componentDidMount() {
    fetch('http://localhost:3001/recipes')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({ recipes: data });
      })
      .catch((err) => {
        console.log(err);
      });

    fetch('http://localhost:3001/specials')
      .then((res) => res.json())
      .then((data) => {
        this.setState({ specialIng: data })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleOpenRecipe(recipe) {
    console.log(recipe);
    this.setState({ showRecipeList: false, currRecipe: recipe, showRecipe: true });
  }

  render() {
    const { recipes, showRecipeList, showRecipe, currRecipe, specialIng } = this.state;
    return (
      <div>
        {showRecipeList && <RecipeList recipes={recipes} onClick={(recipe) => this.setState({ showRecipeList: false, currRecipe: recipe, showRecipe: true })} />}
        {showRecipe && <Recipe recipe={currRecipe} specialIng={specialIng} onReload={() => window.location.reload()} />}
      </div>

    );
  }
}

export default App;
