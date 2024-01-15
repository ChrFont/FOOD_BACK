![HenryLogo](https://d31uz8lwfmyn8g.cloudfront.net/Assets/logo-henry-white-lg.png)

# Individual Project - Henry Food

Es una aplicación en la cual se puedan ver distintas recetas de comida junto con información relevante de las mismas utilizando la api externa [spoonacular](https://spoonacular.com/food-api) y a partir de ella poder, entre otras cosas:

- Buscar recetas
- Filtrarlos / Ordenarlos
- Crear nuevas recetas propias

## Tecnologías Utilizadas

- Frontend: React, Redux
- Backend:  Node.js - Express, Sequelize - PostgreSQL

## Instalación Backend

1. Clona el repositorio: `git clone https://github.com/ChrFont/FOOD_BACK.git`
2. Instala las dependencias `npm install` 
4. Configura la base de datos: tener instalado PostgreSQL

## Instalacion Frontend

1. Clona el repositorio: `git clone https://github.com/ChrFont/FOOD_FRONT.git`
2. Instala las dependencias `npm install` 

## Configuración Backend

crear archivo .env en la raiz del proyecto con la siguiente informacion: 

```js
DB_USER=[tu usuario de postgres]
DB_PASSWORD=[tu clave]
DB_HOST=localhost
API_KEY= [api key de spoonacular] // https://spoonacular.com/food-api
```

## Configuración Frontend
Crear archivo .env en la raiz del proyecto con la siguiente informacion:

```js
REACT_APP_NEXT_PUBLIC_QUERIES=[el puerto en la api en este caso, ej: http://localhost:4000 ]
```
## Iniciar proyecto

`npm run start`

## Contacto

- Autor: Christian Robles Font
- Email: roblesfontc@gmail.com
- [LinkedIn](https://www.linkedin.com/in/christian-robles-font/)

