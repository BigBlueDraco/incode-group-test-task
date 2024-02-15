import { $Enums, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
async function main() {
  console.log('Seeding...');
  const admin = await generateAdmin();
  const users = [setUsersToDb(admin)];
  for (let i = 0; i < 10; i++) {
    const user = await generateUser();
    users.push(setUsersToDb(user));
  }
  try {
    await Promise.all(users);
    console.log('All data has been set to the database');
  } catch (err) {
    console.log('Error setting data to the database:', err);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

async function generateUser() {
  const password = await hash('password123123123', 10);
  return { email: faker.internet.email(), password };
}
async function generateAdmin() {
  const user = {
    email: 'admin@example.com',
    password: 'password123123123',
    role: $Enums.Role.ADMIN,
  };
  const password = await hash(user.password, 10);
  return {
    ...user,
    password,
  };
}
async function setUsersToDb(data) {
  try {
    await prisma.user.create({
      data,
    });
  } catch (err) {
    console.log(err);
  }
}
