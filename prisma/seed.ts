import { PrismaClient, Role, PostVisibility } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de DailySpace...");

  // 1. Limpieza controlada previa
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // 2. Creación de Usuarios de Prueba con bcrypt (Rúbrica: contraseñas nunca en texto plano)
  const passwordSalt = 10;
  const adminPasswordHash = await bcrypt.hash("Admin123!", passwordSalt);
  const userPasswordHash = await bcrypt.hash("User123!", passwordSalt);

  const adminUser = await prisma.user.create({
    data: {
      name: "mariaisabel",
      email: "admin@dailyspace.com",
      password: adminPasswordHash,
      role: Role.admin,
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      name: "carlos_dev",
      email: "user@dailyspace.com",
      password: userPasswordHash,
      role: Role.user,
    },
  });

  console.log(`✅ Usuarios creados:`);
  console.log(`   - Admin: ${adminUser.email} (rol: ${adminUser.role})`);
  console.log(`   - User:  ${normalUser.email} (rol: ${normalUser.role})`);

  // 3. Catálogo: Los 12 posts reales de app.js de la Entrega 1 (fuente de verdad)
  const postsData = [
    {
      author: "mariaisabel",
      title: "Primeros resultados de mi simulación en Python",
      media: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
      content: "Estuve corriendo unos scripts para estructurar datos.",
      visibility: PostVisibility.Publico,
      likes: 8,
    },
    {
      author: "carlos_dev",
      title: "Tarde de café y maquetación CSS",
      media: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
      content: "Organizando el feed.",
      visibility: PostVisibility.Publico,
      likes: 14,
    },
    {
      author: "valentina_sea",
      title: "Un día frente al mar y brisa marina",
      media: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      content: "Hoy desconecté del código y me fui a caminar por la playa. El sonido de las olas te renueva las energías al 100%. 🌊🐚",
      visibility: PostVisibility.Publico,
      likes: 23,
    },
    {
      author: "mateo_trips",
      title: "Paseo de fin de semana por el pueblo",
      media: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
      content: "Aprovechamos el domingo para salir a rodar en carretera, probar comida típica y tomar café en la plaza principal. 🚗☕",
      visibility: PostVisibility.Publico,
      likes: 19,
    },
    {
      author: "sofia_daily",
      title: "Bitácora del lunes: organización y listas",
      media: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80",
      content: "Empezando la semana planificando tareas, objetivos de la universidad y repasando temas pendientes. ¡A darle con toda!",
      visibility: PostVisibility.Privado,
      likes: 5,
    },
    {
      author: "camila_nature",
      title: "Caminata ecológica por la montaña",
      media: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      content: "Subimos al mirador muy temprano para ver el amanecer. Respirar aire puro después de estar frente a la pantalla toda la semana no tiene precio. ⛰️🌲",
      visibility: PostVisibility.Publico,
      likes: 17,
    },
    {
      author: "daniel_cooks",
      title: "Noche de cocina e improvisación",
      media: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
      content: "Intentando preparar pasta artesanal desde cero para desconectar del estudio. Sorprendentemente quedó riquísima. 🍝✨",
      visibility: PostVisibility.Publico,
      likes: 11,
    },
    {
      author: "luisa_notes",
      title: "Tarde de lectura y notas al aire libre",
      media: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      content: "Aproveché la tarde soleada para adelantar lecturas de la clase en el parque del campus. 📚🍂",
      visibility: PostVisibility.Privado,
      likes: 9,
    },
    {
      author: "andres_travels",
      title: "Atardecer campestre en la finca",
      media: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
      content: "Terminando la semana rodeado de naturaleza. No hay nada como ver caer el sol en el campo para despejar la mente. 🌅🌾",
      visibility: PostVisibility.Publico,
      likes: 21,
    },
    {
      author: "isabel_cozy",
      title: "Noche de pelis y chocolates picantes",
      media: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
      content: "Lluvia afuera, cobija afelpada y maratón de películas viejas. El mejor plan relajante para un domingo por la noche. 🍿☕",
      visibility: PostVisibility.Privado,
      likes: 12,
    },
    {
      author: "mateo_trips",
      title: "Descubriendo nuevos rincones en la ciudad",
      media: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      content: "Hoy salí a recorrer el centro histórico sin mapa ni rumbo. Encontré una librería de usados llena de tesoros escondidos. 📖🏛️",
      visibility: PostVisibility.Publico,
      likes: 16,
    },
    {
      author: "mariaisabel",
      title: "Revisión final de código para la Entrega 1",
      media: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
      content: "Verificando que todo el CSS Grid, Flexbox y la validación en JS funcionen impecable antes de desplegar en Vercel. 💻🚀",
      visibility: PostVisibility.Publico,
      likes: 25,
    },
  ];

  const createdPosts = [];
  for (const p of postsData) {
    const post = await prisma.post.create({ data: p });
    createdPosts.push(post);
  }
  console.log(`✅ ${createdPosts.length} publicaciones cargadas en el catálogo.`);

  // 4. Interacción inicial: Comentarios vinculados a User y Post
  if (createdPosts.length > 0) {
    await prisma.comment.createMany({
      data: [
        {
          content: "¡Genial avance!",
          userId: normalUser.id,
          postId: createdPosts[0].id,
        },
        {
          content: "Sigue así 👏",
          userId: adminUser.id,
          postId: createdPosts[0].id,
        },
        {
          content: "El tono amarillo pastel se ve muy bien.",
          userId: adminUser.id,
          postId: createdPosts[1].id,
        },
        {
          content: "¡Qué envidia de vista!",
          userId: normalUser.id,
          postId: createdPosts[2].id,
        },
      ],
    });
    console.log(`✅ Comentarios iniciales de interacción creados.`);
  }

  console.log("🎉 Seed completado exitosamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
