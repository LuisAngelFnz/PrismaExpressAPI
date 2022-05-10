const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async function main() {
  try {

    await prisma.Mission.upsert({
      where :{name:'Mission BackEnd Java'},
      update :{},
      create :{
        name :'Mission BackEnd Java',
        lang :'Java',
        missionCommander : 'Fernanda',
        enrollments :2,
        hasCertification :true,
      }
    });

    await prisma.Mission.upsert({
      where :{name:'Mission BackEnd Node'},
      update :{},
      create :{
        name :'Mission BackEnd Node',
        lang :'JavaScript',
        missionCommander : 'Carlo',
        enrollments :3,
        hasCertification :false,
      }
    });

    await prisma.Mission.upsert({
      where :{name:'Mission FrontEnd JavaScript'},
      update :{},
      create :{
        name :'Mission BackEnd JavaScript',
        lang :'JavaScript',
        missionCommander : 'Juan Rodrigo',
        enrollments :1,
        hasCertification :false,
      }
    });

  } catch(e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();