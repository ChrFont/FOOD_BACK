const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const PARAMETERS = "&addRecipeInformation=true&number=20"
const axios = require('axios')
const {Recipe,Diet} = require('../db');
const {API_KEY} = process.env
const KEY = `?apiKey=${API_KEY}`;
const router = Router();
const {dietas} = require("../dietas");
const { NUMBER } = require('sequelize');
//repaso m2 cohorte 22a diego rodriguez
//********Si muevo api key mas arriba me la deja en default ********
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const getApiInfo = async () =>{
    const apiUrl = await axios.get("https://api.spoonacular.com/recipes/complexSearch" + KEY + PARAMETERS)
    const apiInfo = apiUrl.data.results.map(e => {
        let pasos = []
        if(e.analyzedInstructions.length > 0){
            Object.entries(e.analyzedInstructions[0].steps).forEach(([key,value]) => {pasos.push(value.step)})
        }
        return {
            id: e.id,
            name: e.title,
            image: e.image,
            diets: e.diets,
            tipoDePlato: e.dishTypes,
            summary: e.summary,
            healthScore: e.healthScore,
            steps: pasos
        }
    })
    
    return apiInfo
}

const getDbInfo = async () =>{
    const dBData = await Recipe.findAll({
        include: {
            model: Diet,
            attributes: ['name'],
            through: {
                attributes: []
            }
        }
    })
    const dBInfo = dBData.map(e => {
        let pasos = []
        e.diets.map(e => {pasos.push(e.name)})
        return{
            id: e.id,
            name: e.name,
            summary: e.summary,
            healthScore: e.healthScore,
            steps: e.steps,
            diets: pasos
        }
    })
    return dBInfo
}


const getAllRecipes = async () => {
    const apiInfo = await getApiInfo()
    const dbInfo = await getDbInfo()
    const infoTotal = apiInfo.concat(dbInfo)
    
    return infoTotal
}

router.get('/recipes', async (req,res) => {
    const name = req.query.name
    let allRecipes = await getAllRecipes()
    console.log(name);
    try {
        if(name){
            let recipesFilter = ""
            console.log(name);
            if(Number(name)){
                console.log("healtscore");
                recipesFilter = await allRecipes.filter(e => e.healthScore == name)
            }else {
                recipesFilter = await allRecipes.filter(e => e.name.toLowerCase().includes(name.toLowerCase()))
            }
            res.status(200).send(recipesFilter)
            
        }else {
            let recipesTotal = allRecipes.map(e => {
                return {
                    id: e.id,
                    name: e.name,
                    image: e.image,
                    diets: e.diets,
                    tipoDePlato: e.tipoDePlato,
                    healthScore: e.healthScore
                }
            })
            res.status(200).send(recipesTotal)
        }
    } catch (error) {
        console.log(error);
        res.status(404).send(error)
    }
})

router.get('/recipes/:recipeId', async (req,res) => {
    const allRecipes = await getAllRecipes()
    try {
        const {recipeId} = req.params
        const idRecipeFilter = await allRecipes.filter(e => e.id == recipeId)
        let summary = idRecipeFilter[0].summary
        summary = summary.replaceAll(/(<([^>]+)>)/ig , "")
        console.log(summary);

        let dataFilter = idRecipeFilter.map(e => {
            return {
                id: e.id,
                name: e.name,
                image: e.image,
                diets: e.diets,
                tipoDePlato: e.tipoDePlato,
                summary: summary,
                healthScore: e.healthScore,
                steps: e.steps
            }
        })
        dataFilter.length ?
        res.status(200).send(dataFilter): alert("No existe receta con ese id")
        
    } catch (error) {
        console.log(error);
        res.status(404).send(error) 
    }
})

router.post('/recipes', async (req,res) => {
    try {
        const {name, summary, healthScore, steps, diets} = req.body
        let recipeCreated = await Recipe.create({name, summary, healthScore, steps})

        let dietDb = await Diet.findAll({ where: { name: diets}})
        await recipeCreated.addDiet(dietDb)

        let a = await getDbInfo()
        console.log(a);
        res.status(200).send(a)
    } catch (error) {
        console.log(error);
        res.status(404).send(error) 
    }
})

router.get('/diets', async (req,res) => {
    try {
        dietas.forEach((e,index) => {
            Diet.findOrCreate({
                where: {
                    id: index,
                    name: e
                }
            })
        })
        if(dietas.length){
            res.status(200).send(dietas)
        }else{
            res.status(400).send("no se encontraron dietas")
        }
    } catch (error) {
        res.status(404).send(error)
    }
        
})
module.exports = router;
