const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// require para usar Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/', (request, response) => {
  response.json({message: 'alive'});
});

const hasattr = Object.prototype.hasOwnProperty;

//////////////////////////
//        Explorers     //
//////////////////////////
app.get('/explorers', async (request, response) => {
    const allExplorers =  await prisma.explorer.findMany({});
    response.json(allExplorers);
});

app.get('/explorers/:id', async (request, response) => {
    const id = request.params.id;
    const explorer = await prisma.explorer.findUnique({where: {id: parseInt(id)}});
    response.json(explorer);
});

app.post('/explorers', async (request, response) => {
    try{
        const explorer = {
            name     : request.body.name,
            username : request.body.username,
            mission  : request.body.mission
        };
        
        await prisma.explorer.create({data: explorer});
        return response.json({message:'Explorer creado.'});

    }catch(error){

        if(error.code == 'P2002'){
            return response.status(401).json({message:'Ya existe un explorer con los parametros proporcionados'});
        }
        console.log('Error in request CreateExplorer\n',error);
        return response.status(500).json({message:'Internal Error'});
    }

});

app.put('/explorers/:id', async (request, response) => {
  const id = parseInt(request.params.id);

  await prisma.explorer.update({
    where: {
      id: id
    },
    data: {
      mission: request.body.mission
    }
  })

  return response.json({message: "Actualizado correctamente"});
});

app.delete('/explorers/:id', async (request, response) => {
  const id = parseInt(request.params.id);
  await prisma.explorer.delete({where: {id: id}});
  return response.json({message: "Eliminado correctamente"});
});


//////////////////////////
//       Mission        //
//////////////////////////
app.get('/missions', async (requestuest, response) => {
  const all_missions = await prisma.Mission.findMany({});
  return response.json(all_missions);
});

app.get('/missions/:id', async (request, response) => {
  const id = request.params.id;
  const mission = await prisma.Mission.findUnique({where: {id: parseInt(id)}});
  response.json(mission);
});

app.post('/missions', async (request, response) => {
    try{
        const exist_undefined = [
            'name',
            'lang',
            'missionCommander',
            'enrollments', 
            'hasCertification'
        ].some(
            (attr) => {
                return ! hasattr.call(request.body, attr) || [null,undefined].includes(request.body[attr]);
            }
        )
        
        if(exist_undefined){
            return response.status(400).json({message:'Parametros inválidos'})
        }

        const new_mission = {
            name             : request.body.name,
            lang             : request.body.lang,
            missionCommander : request.body.missionCommander,
            enrollments      : request.body.enrollments,
            hasCertification : request.body.hasCertification,
        };
        await prisma.Mission.create({data: new_mission});
        return response.json({message:'Misión creada.'});

    }catch(error){

        if(error.code == 'P2002'){
            return response.status(401).json({message:'Ya existe una misión con los parametros proporcionados'});
        }
        console.log('Error in request CreateMission\n',error);
        return response.status(500).json({message:'Internal Error'});
    }
});

app.put('/missions/:id', async (request, response) => {
  const id = parseInt(request.params.id);

  await prisma.Mission.update({
    where: {
      id: id
    },
    data: {
      lang: request.body.lang
    }
  })

  return response.status(200).json({message: "Misión Actualizada correctamente"});
});

app.delete('/missions/:id', async (request, response) => {
  const id = parseInt(request.params.id);
  await prisma.Mission.delete({where: {id: id}});
  return response.json({message: "Misión Eliminada correctamente"});
});

app.listen(port, () => {
  console.log(`Listening to requestuests on port ${port}`);
});

